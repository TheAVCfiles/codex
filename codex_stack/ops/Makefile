.PHONY: install build preview deploy

install:
	npm -C ../codex_cli i
	npm -C ../ledger_demo i
	npm -C ../zero_loss_site i

build:
	npm -C ../codex_cli run build
	npm -C ../ledger_demo run build
	npm -C ../zero_loss_site run build

preview:
	npx -C ../ledger_demo astro dev
	npx -C ../zero_loss_site astro dev

deploy:
	npx wrangler -c ../dtg_worker/wrangler.toml publish
	npx wrangler pages publish ../ledger_demo/dist
	npx wrangler pages publish ../zero_loss_site/dist
