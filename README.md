# RC Car

This code allows an ESP8266 to control a remote controlled car, using a websocket to allow commands to be sent over WiFi. 

## Setup

To allow Windows to connect to the ESP8266, first install the Windows driver:

[http://www.wch.cn/downloads/CH341SER_EXE.html](http://www.wch.cn/downloads/CH341SER_EXE.html)

Then [install Python](https://www.python.org/downloads/windows/), and use PIP to install ESPTool:

```powershell
pip install esptool
```

Because this code uses JavaScript, the ESP8266 needs to be flashed with the Espruino firmware. Download the latest binaries from:

[https://www.espruino.com/binaries/espruino_2v03_esp8266_4mb/](https://www.espruino.com/binaries/espruino_2v03_esp8266_4mb/)

From within the folder that you download the firmware files to, run the following command to flash the ESP8266 with the latest Espruino firmware. Just change the COM port to the port that the EsP8266 is using.

```powershell
esptool.py write_flash --port COM6 --baud 115200 --flash_freq 80m --flash_mode qio --flash_size 4MB 0x0000 boot_v1.6.bin 0x1000 espruino_esp8266_user1.bin 0x3FC000 esp_init_data_default.bin 0x3FE000 blank.bin
```

To fix bad code, run:

```powershell
esptool.py write_flash --port COM6 --baud 115200 --flash_freq 80m --flash_mode qio --flash_size 4MB 0x3FE000 blank.bin
```

To upload code to the ESP8266, use the Espruino IDE, which can be downloaded from:

[https://www.espruino.com/Web+IDE](https://www.espruino.com/Web+IDE)

## How it Works

