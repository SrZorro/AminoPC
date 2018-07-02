# Amino Desktop Client

## Amino in PC!? I want it, as an user how can I have it?

Go to [this link](https://github.com/SrZorro/AminoPC/releases) and download the version for your operative system.

| Operative system | Your version is                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Windows 32 bits  | AminoPC-win32-ia32.zip                                                                   |
| Windows 64 bits  | AminoPC-win32-x64.zip                                                                    |
| Linux 64 bits    | amino-pc_1.0.0_amd64.deb                                                                 |
| Linux 32 bits    | Sorry, i didn't compiled a version yet                                                   |
| Mac              | I don't have an Apple product to compile it, im not going to give support for it, sorry. |

The windows version is a zip containing a bunch of files, betweem them there is one called _AminoPC.exe_, you have to execute that file INSIDE that folder.

### AminoPC is asking me for a DeviceID, but I don't have one.

Yes, you need a DeviceID, that is not the average DeviceID that you can get with an app installed in your phone, its a special one generated by the AminoApp. 

So, there are two ways to resolve the "DeviceID" input box.

#### Easy way

Use this key I prepared for public use:

`TODO: Add the device ID`

And you are set.

> WARNING! If you want to use that device ID that means that in the future Narvii COULD ban your account. Use at your own risk. 

#### Not so easy

So, first im going to explain the objective and then the simplest method you can use, but you can do it in a bunch of other ways (My prefered one is with the [Android SDK/AVD](https://developer.android.com/studio/run/managing-avds?hl=en-419) with [mitmproxy](https://mitmproxy.org/)).

The objective: Do a [man in the middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) to the Amino app so we can intercept the auth request and get our own DeviceID.

Requisites:
- An Android device.
- Amino app installed.


1) Download and install [Packet Capture](https://play.google.com/store/apps/details?id=app.greyshirts.sslcapture) in your android device.
2) Logout from the Amino App. This is located at the "My joined Aminos" screen, at the top right click in the gear, scroll to bottom and "Close session".
3) Open the Packet Capture app.
4) The app will ask you to install a certificate, give them permission for it and follow the steps.
4) When you finished the installation process, click the green play button with an "1" at the top right.
5) Search and select "Amino".
6) Now the Packet Capture is ready to capture packets from Amino.
7) Switch to Amino and login.
8) Switch back to the Packet Capture app and stop the recording (top right, red box).
9) Click the first field (the only one you should have) where should say the current date an underneath "X captures" (X should be more than 1)
10) Click one of the elements where at the right says "SSL" in red.
11) In the first text box, should say at the start "POST /api/v1/g/s/auth/login HTTP/1.1", if it does, go to step 12, if not, go back to 10. If you checked all of them, repeat from step 4.
12) Underneath the first text block, a second one should have your email, your "secret" (aka password) and a field called "deviceID", thats the one you want to login in AminoPC.
13) _Optional:_ Now you can uninstall the Packet Capture app and if you desire it can also remove the pass code for your android phone, but its recomended to have one

## Im a developer, how can i help?

ToDo... 