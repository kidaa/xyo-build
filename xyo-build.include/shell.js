//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

Script.requireExtension("Shell");

Shell.cmd=function(command) {
	Console.writeLn(command);
	if(Shell.system(command)) {
		throw(new BuildError("Error command: "+command));
	};
};

Shell.preparePath=function(path) {
	var x;
	if(Shell.fileExists(path)) {
		throw(new BuildError("Path is a file: "+path));
	};
	if(!Shell.directoryExists(path)) {
		Shell.mkdirRecursively(path);
	};
	return true;
};

Shell.prepareFilePath=function(file) {
	var path;
	path=.getFilePath(file);
	if(path) {
		.preparePath(path);
	};
};

Shell.cmdX=function(command) {
	Console.writeLn(command);
	return Shell.system(command);
};

