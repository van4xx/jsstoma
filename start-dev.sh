#!/bin/bash
# Скрипт для запуска клиентской и серверной части приложения одновременно

echo "Запуск серверной части..."
cd server && npm install && npm run dev &
SERVER_PID=$!

echo "Запуск клиентской части..."
cd client && npm install && npm start &
CLIENT_PID=$!

# Обработка завершения скрипта
function cleanup {
    echo "Завершение работы..."
    kill $SERVER_PID
    kill $CLIENT_PID
    exit
}

# Перехват сигналов завершения
trap cleanup SIGINT SIGTERM

echo "Приложение запущено. Нажмите Ctrl+C для завершения."
wait 