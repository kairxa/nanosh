package main

import (
	"context"
	"database/sql"
	"nanosh/nakama-modules/utils"
	"time"

	"github.com/heroiclabs/nakama-common/runtime"
)

func InitModule(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, initializer runtime.Initializer) error {
	initStart := time.Now()

	err := initializer.RegisterRpc("healthcheck", utils.RpcHealthcheck)
	if err != nil {
		return err
	}

	logger.Info("Modules loaded in %dms", time.Since(initStart).Milliseconds())
	return nil
}
