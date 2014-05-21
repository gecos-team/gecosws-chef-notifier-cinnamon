/* GECOS ChefSnitch Activity Notifier for Cinnamon

Copyright (C) 2014 Junta de Andalucia. <http://www.juntadeandalucia.es/>

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use, copy,
 modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.

*/

const Lang = imports.lang;
const Applet = imports.ui.applet;
const DBus = imports.dbus;
const Main = imports.ui.main;

// DBus
//
const BUS_NAME = 'org.guadalinex.ChefSnitch';
const OBJECT_PATH = '/org/guadalinex/ChefSnitch';

// Messages
//
const APPLET_TITLE = 'GECOS Chef Snitch';
const ACTIVE_TRUE_MSG = 'Chef is working on your system, please do ' +
                        'not shutdown your computer until the process ' +
                        'is finished';
const ACTIVE_FALSE_MSG = 'Chef is not working on your system right now';

// Chef Snitch Service specification
//
const ChefSnitchServiceInterface = {
  name: "org.guadalinex.ChefSnitch",
  methods: [
    {name: "NotifyMessage", inSignature: 's', outSignature: 'b'},
    {name: "GetActive",     inSignature: '',  outSignature: 'b'},
    {name: "SetActive",     inSignature: 'b', outSignature: 'b'},
    {name: "GetMessage",    inSignature: '',  outSignature: 's'}
  ],
  signals: [
    {name: 'IsActiveHasChanged'},
    {name: 'MessageNotified'}
  ]
};

let ChefSnitchServiceProxy = DBus.makeProxyClass(ChefSnitchServiceInterface);

// Applet 
//
function MyApplet(orientation) {
  this._init(orientation);
}

MyApplet.prototype = {
  __proto__: Applet.IconApplet.prototype,
  _init: function(orientation){
    Applet.IconApplet.prototype._init.call(this, orientation);
      this.set_applet_icon_symbolic_name('emblem-system-symbolic');

      this.proxy = new ChefSnitchServiceProxy(DBus.system, BUS_NAME, OBJECT_PATH);
      this.proxy.connect('IsActiveHasChanged', Lang.bind(this, this._updateIcon));
      this.proxy.connect('MessageNotified', Lang.bind(this, this._doNotify));

      this._isFirstRun = true;
      this._updateIcon();
  },
  _updateIcon: function () {
    this.proxy.GetActiveRemote(Lang.bind(this, function (active, err) {
      if (active) {
        this.set_applet_icon_symbolic_name('emblem-synchronizing-symbolic');
        this.set_applet_tooltip(ACTIVE_TRUE_MSG);
        Main.notify(APPLET_TITLE, ACTIVE_TRUE_MSG);
      } else {
        this.set_applet_icon_symbolic_name('emblem-system-symbolic');
        this.set_applet_tooltip(ACTIVE_FALSE_MSG);
        Main.notify(APPLET_TITLE, ACTIVE_FALSE_MSG);
        // Do not notify if _isFirstRun
        //if (!this._isFirstRun) { Main.notify(APPLET_TITLE, ACTIVE_FALSE_MSG) };
      }
      this._isFirstRun = false;
    }));
  },
  _doNotify: function() {
    this.proxy.GetMessageRemote(Lang.bind(this, function (message, err) {
      Main.notify(APPLET_TITLE, message);
    }));
  },
}

function main(metadata, orientation) {
  let myApplet = new MyApplet(orientation);
  return myApplet;
}
