const os = require('os-utils');

function monitorCPU() {
    setInterval(() => {
        os.cpuUsage((v) => {
            if (v > 0.7) {
                console.log('CPU usage exceeded 70%, restarting server...');
                process.exit(1); 
            }
        });
    }, 5000); 
}

module.exports = monitorCPU;
