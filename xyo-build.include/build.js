//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

Script.requireExtension("File");
Script.requireExtension("Shell");
Script.requireExtension("Make");
Script.requireExtension("MD5");
Script.requireExtension("Base64");

Build.solution_= {};
Build.variant_="release";
Build.mode_="build";
Build.script_="workspace.xyo-build.js";
Build.platform_=null;
Build.threadsCount_=8;
Build.isLocal_=null;

Build.solution=function(name,proc) {
	Build.solution_[name]=new Solution();
	Build.solution_[name].name(name);
	proc.apply(Build.solution_[name]);
};

Build.variant=function(x) {
	Build.variant_=x;
};

Build.getVariant=function() {
	return Build.variant_;
};

Build.parseCommandLine=function() {
	var m;
	var cmdN;
	var cmdS;
	var option;
	var found;
	var found2;

	found2=false;
	cmdN=Application.getCmdN();
	for(m=1; m<cmdN; ++m) {
		cmdS=Application.getCmdS(m);
		if(cmdS.substring(0,2)=="--") {
			found=false;
			option=cmdS.substring(2);
			if(option=="local") {
				.isLocal_=true;
				continue;
			};
			++m;
			if(m<cmdN) {
				if(option=="mode") {
					found=true;
					.mode_=Application.getCmdS(m);
				};
				if(option=="variant") {
					found=true;
					.variant_=Application.getCmdS(m);
				};
				if(option=="platform") {
					found=true;
					.platform_=Application.getCmdS(m);
				};
				if(option=="script") {
					found=true;
					.script_=Application.getCmdS(m);
				};
			};
			if(found) {} else {
				--m;
			};
		} else {
			if(m==1) {
				cmdS=Shell.getFileExtension(cmdS);
				if(!cmdS) {
					.mode_=Application.getCmdS(m);
				} else {
					cmdS=cmdS.toLowerCaseAscii();
					if(cmdS=="js") {
						.script_=Application.getCmdS(m);
						found2=true;
					};
				};
			} else if(found2) {
				if(m==2) {
					.mode_=Application.getCmdS(m);
				};
			};
		};
	};

};

Build.run=function(options) {
	var cmd;
	var opt;

	opt= {};
	ForEach(options,function(key,value) {
		opt[key]=value;
	});

	if(Script.isNil(opt["script"])) {
		opt["script"]=.script_;
	};

	if(Script.isNil(opt["mode"])) {
		opt["mode"]=.mode_;
	};

	if(Script.isNil(opt["variant"])) {
		opt["variant"]=.variant_;
	};

	if(Script.isNil(opt["local"])) {
		opt["local"]=.isLocal;
	};

	cmd="";
	ForEach(opt,function(key,value) {
		if(key=="local") {
			if(Script.isNil(value)) {
				continue;
			};
			cmd=cmd+" --"+key;
		} else {
			cmd=cmd+" --"+key+" "+value;
		};
	});

	Console.write("xyo-build"+cmd+"\n");
	if(Shell.system(Application.getExecutable()+cmd)) {
		throw(new BuildError("Reported error."));
	};
};

Build.runFromDirectory=function(directory,options) {
	var cwd;
	var opt;

	opt= {};
	ForEach(options,function(key,value) {
		opt[key]=value;
	});

	if(Script.isNil(opt["script"])) {
		opt["script"]="workspace.xyo-build.js";
	};

	cwd=Shell.getcwd();
	if(Shell.chdir(directory)) {
		Console.writeLn("Build: directory changed to: "+ directory);
		try {
			.run(opt);
			Shell.chdir(cwd);
		} catch(e) {
			Shell.chdir(cwd);
			throw(e);
		};
	} else {
		throw(new BuildError("Unable to chdir to "+directory));
	};
};

Build.cmdMode=function() {
	if(.mode_=="debug") {
		.mode_="build";
		.variant_="debug";
		return false;
	};
	if(.mode_=="rebuild") {
		.run({
			mode:"clean"
		});
		.run({
			mode:"build"
		});
		return true;
	} else if(.mode_=="build-x-sign-x-install") {
		.run({
			mode:"build"
		});
		.run({
			mode:"sign"
		});
		.run({
			mode:"install"
		});
		return true;
	} else if(.mode_=="build-x-sign-x-unify") {
		.run({
			mode:"build"
		});
		.run({
			mode:"sign"
		});
		.run({
			mode:"unify"
		});
		return true;
	} else if(.mode_=="build-x-install") {
		.run({
			mode:"build"
		});
		.run({
			mode:"install"
		});
		return true;
	} else if(.mode_=="build-x-unify") {
		.run({
			mode:"build"
		});
		.run({
			mode:"unify"
		});
		return true;
	} else if(.mode_=="debug-x-install") {
		.run({
			mode:"build",
			variant:"debug"
		});
		.run({
			mode:"install",
			variant:"debug"
		});
		return true;
	} else if(.mode_=="debug-x-unify") {
		.run({
			mode:"build",
			variant:"debug"
		});
		.run({
			mode:"unify",
			variant:"debug"
		});
		return true;
	} else if(.mode_=="deinstall") {
		.run({
			mode:"uninstall"
		});
		return true;
	} else if(.mode_=="reinstall") {
		.run({
			mode:"uninstall"
		});
		.run({
			mode:"install"
		});
		return true;
	} else if(.mode_=="release") {
		.run({
			mode:"version"
		});
		.run({
			mode:"build"
		});
		return true;
	};
	if(.mode_=="clean-all") {
		.run({
			mode:"uninstall"
		});
		.run({
			mode:"clean"
		});
		return true;
	};
	return false;
};

Build.includeScript=function(name) {
	Script.include.call(this,name);
};

Build.isMode=function(mode) {
	return (.mode_==mode);
};

