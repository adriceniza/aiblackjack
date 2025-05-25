FROM golang:1.24.3-alpine

WORKDIR /app

COPY go.mod .

COPY go.sum .

RUN go mod download

COPY . .

EXPOSE 8080

CMD ["go", "run", "cmd/server/main.go"]