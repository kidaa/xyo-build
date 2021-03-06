//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

Script.include("xyo-build/platform.win64-msvc.js");

Platform.name="win64-msvc";
Platform.machineType="X64";
Platform.osType="WIN64";
Platform.osPath="win64-msvc";
Platform.osExtra="";
Platform.osDllEntry="_DllMainCRTStartup";

Platform.is=function(os) {
	if(os=="win") {
		return true;
	};
	if(os=="win64") {
		return true;
	};
	return false;
};

