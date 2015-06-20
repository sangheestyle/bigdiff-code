start:
	forever stopall
	forever start app.js
	forever start cron.js

stop:
	forever stopall
