```benv
ROOT_VAR="root_value"

DEV:
	PORT=5000
	HOST="https://localhost:$PORT"
	DB:
		USERNAME="$ROOT_VAR.admin"
		PASSWORD="$USERNAME.$PORT.12345"
	SECURE=false

PROD:
	HOST="app.cool.com"
	PORT=8080
	DB:
		USERNAME="admin"
		PASSWORD="136_@rongPas."
	SECURE=true

ENV="dev"
LANG=if (ENV == "prod") "en/US" else "fr/FR"
```
