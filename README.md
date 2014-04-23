GECOS Chef activity notifier for Cinnamon 
=========================================

**GECOS Chef activity notifier for Cinnamon** is an applet that can be used in
Cinnamon to use the [GECOS Chef Snitch Service](https://github.com/gecos-team/gecosws-chef-snitch) to notify the user about certain events.

Basically, it create notifications when:

 - chef-client is working
 - chef-client has finished
 - as an output of chef, the user can receive messages (ie: to perform an action)

Installation
------------

You can install this applet like the any other applet for Cinnamon, the only
constraint is that the code in _src_ has to be placed into a directory called
__gecosws-chef-activity-notifier-cinnamon@guadalinex.org__, either locally 
(_~.local/share/cinnamon/applets/_) or globally (_/usr/share/cinnamon/applets/_).

After that, add the applet to your panel.

Contributing
------------

1.  Fork the repository on Github
2.  Create a named feature branch (like `add_component_x`)
3.  Write your change
4.  Submit a Pull Request using Github

