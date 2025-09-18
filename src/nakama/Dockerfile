FROM heroiclabs/nakama-pluginbuilder:3.31.0 AS builder

ENV CGO_ENABLED 1

WORKDIR /backend
COPY go.mod .
COPY *.go ./
COPY utils/ utils/
COPY vendor/ vendor/

RUN go build --trimpath --mod=vendor --buildmode=plugin -o ./nakama-modules.so

FROM heroiclabs/nakama:3.31.0

COPY --from=builder /backend/nakama-modules.so /nakama/data/modules/
COPY local.yml /nakama/data
