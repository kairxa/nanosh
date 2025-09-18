package utils

import (
	"context"
	"database/sql"
	"encoding/json"

	"github.com/heroiclabs/nakama-common/runtime"
)

const (
	ERROR_MESSAGE = "Error marshalling utils/healthcheck: %v"
)

type HealthcheckResponse struct {
	Success bool `json:"success"`
}

func RpcHealthcheck(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {
	logger.Debug("Healthcheck RPC called")
	response := &HealthcheckResponse{
		Success: true,
	}

	out, err := json.Marshal(response)
	if err != nil {
		logger.Error(ERROR_MESSAGE, err)
		return "", err
	}

	return string(out), nil
}
