"use strict";

/* load server components */
global.startTimestamp = new Date().getTime();
require('./initializer.js');
watermark.show();
server.start();
