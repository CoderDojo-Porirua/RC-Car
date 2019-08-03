# Brookstone Rover

## Connecting

In PowerShell, run:

```powershell
netsh wlan show interfaces
netsh wlan show wirelesscapabilities
```

Look for "IBSS: Supported" for your Wireless card.

If our WiFi adapter can run in IBSS mode, we first need to add a new network manually:

In Windows, go to Settings, Network & Internet, WiFi, Manage Known Networks and Add a new network with Network name AC13_00E04C071762 and Security type Open.

Now change the profile for this network to

```powershell
netsh wlan set profileparameter interface="Wi-Fi 2" AC13_00E04C071762 connectiontype=ibss
```

Now that we're connected, we can connect to the tank:

[http://192.168.1.100/](http://192.168.1.100/)

We can also send commands, to drive the wheels:

[http://192.168.1.100/wifi_car_control.cgi?param=10&command=1](http://192.168.1.100/wifi_car_control.cgi?param=10&command=1)

- Right wheel stop = 0
- Right wheel forward = 1
- Right wheel backward = 2
- Left wheel stop = 3
- Left wheel forward = 4
- Left wheel backward = 5
