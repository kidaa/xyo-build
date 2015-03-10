//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

Platform.name="win32-msvc";
Platform.machineType="X86";
Platform.osType="WIN32";
Platform.osPath="win32-msvc";
Platform.osExtra=" /arch:SSE2";
Platform.osDllEntry="_DllMainCRTStartup@12";

Platform.defaultLibrary=[
				"user32",
				"gdi32",
				"ws2_32",
				"ole32",
				"wininet",
				"advapi32",
				"ole32",
				"oleaut32",
				"shell32",
				"iphlpapi"
			];

Platform.originalEnvPath=Shell.getenv("PATH");

Platform.buildProject=function(solution,project,mode) {
	.setEnvPath(solution,project);
	.optionGenerate(solution,project,mode);
	switch(mode) {
		case "build":
			Shell.preparePath(.buildPath(solution).replace("/","\\"));
			switch(project.type_) {
				case "lib":
				case "private-lib":
					return .buildLib(solution,project);
					break;
				case "dll":
				case "private-dll":
					return .buildDll(solution,project);
					break;
				case "exe":
				case "private-exe":
					return .buildExe(solution,project);
					break;
				case "install":
				case "version":
					return true;
					break;
				case "process":
				case "private-process":
					if(project.process(mode,solution)) {
						.writeProjectLocalDependencyProcess(solution,project);
						return true;
					};
					return false;
					break;
				case "dependency-lib":
					.writeProjectLocalDependencyLib(solution,project,false);
					break;
				case "dependency-dll":
					.writeProjectLocalDependencyDll(solution,project,false);
					break;
				case "dependency-exe":
					.writeProjectLocalDependencyExe(solution,project);
					break;
				case "dependency-process":
					.writeProjectLocalDependencyProcess(solution,project);
					break;
				default:
					throw(new BuildError("Platform: Unknow how to process '"+mode+"' on project type '"+project.type_+"'"));
			};
			break;
		case "unify":
		case "install":
			Shell.preparePath(.installPathX(solution.name_,mode));
			switch(project.type_) {
				case "lib":
					return .installLib(solution,project,mode,true);
					break;
				case "dll":
					return .installDll(solution,project,mode,true);
					break;
				case "exe":
					return .installExe(solution,project,mode,true);
					break;
				case "install":
					return .installProject(solution,project,mode,true);
					break;
				case "version":
					return true;
					break;
				case "process":
					if(project.process(mode,solution)) {
						return .installProject(solution,project,mode,true);
					};
					return false;
					break;
				case "private-lib":
				case "private-dll":
				case "private-exe":
				case "private-process":
					return true;
					break;
				case "dependency-lib":
					return .installLib(solution,project,mode,false);
					break;
				case "dependency-dll":
					return .installDll(solution,project,mode,false);
					break;
				case "dependency-exe":
					return .installExe(solution,project,mode,false);
					break;
				case "dependency-process":
					return .installProcess(solution,project,mode,false);
					break;
				default:
					throw(new BuildError("Platform: Unknow how to process '"+mode+"' on project type '"+project.type_+"'"));
			};
			break;
		case "clean":
			if(project.type_=="process") {
				if(project.process(mode,solution)) {
					.buildClean(solution,project);
				};
				break;
			};
			.buildClean(solution,project);
			break;
		case "uninstall":
			.uninstallProject(solution,project);
			break;
		case "version":
			.versionProject(solution,project);
			break;
		case "sign":
			switch(project.type_) {
				case "dll":
					return .digitalSignDll(solution,project);
					break;
				case "exe":
					return .digitalSignExe(solution,project);
					break;
				case "process":
					return project.process(mode,solution);
					break;
				default:
					return true;
			};
			break;
		case "licence":
			return .listLicence(solution,project);
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process '"+mode+"'"));
	};
};

Platform.buildPath=function(solution) {
	return .buildPathX(solution.name_,Build.variant_);
};

Platform.buildPathX=function(solutionName,buildVariant) {
	return .pathRepository()+"/.build/"+solutionName+"/"+buildVariant;
};

Platform.buildPathXSolution=function(solutionName,buildVariant) {
	return .pathRepository()+"/.build/"+solutionName;
};


Platform.installPathX=function(solutionName,buildMode) {
	switch(buildMode) {
		case "unify":
			return .pathRepository()+"/.unify";
			break;
	};

	return .pathRepository()+"/"+solutionName;
};

Platform.pathRepository=function() {
	var xyoPathRepository;

	xyoPathRepository=Shell.getenv("XYO_PATH_REPOSITORY");
	if(xyoPathRepository.length==0) {
		throw(new BuildError("Platform: environment XYO_PATH_REPOSITORY not defined"));
	};

	return xyoPathRepository+.osPath;
};

Platform.pathDependency=function() {
	return .pathRepository()+"/.dependency";
};

Platform.pathUninstall=function() {
	return .pathRepository()+"/.uninstall";
};


Platform.uniqueBuildFileName=function(solution,project,file,extension) {
	return .buildPath(solution)+"/"+.uniqueFileName(solution,project,file,extension);
};

Platform.buildLib=function(solution,project) {
	var make;
	var fileH;
	var fileHpp;
	var fileC;
	var fileCpp;
	var fileObj;
	var fileObjList;
	var fileLib;

	make=new Make();

	fileH=.getFileCategory(solution,project,"source","h");
	fileHpp=.getFileCategory(solution,project,"source","hpp");
	fileC=.getFileCategory(solution,project,"source","c");
	fileCpp=.getFileCategory(solution,project,"source","cpp");

	if(fileH.length) {
		ForEach(fileC,function(key) {
			make.target(fileC[key],fileH,make.cmdTouch,fileC[key]);
		});

		ForEach(fileCpp,function(key) {
			make.target(fileCpp[key],fileH,make.cmdTouch,fileCpp[key]);
		});

	};

	if(fileHpp.length) {
		ForEach(fileCpp,function(key) {
			make.target(fileCpp[key],fileHpp,make.cmdTouch,fileCpp[key]);
		});
	};

	fileObj= {};

	ForEach(fileC,function(key) {
		fileObj[Platform.processCToObj(solution,project,make,fileC[key])]=true;
	});

	ForEach(fileCpp,function(key) {
		fileObj[Platform.processCppToObj(solution,project,make,fileCpp[key])]=true;
	});

	fileObjList=[];
	ForEach(fileObj,function(key) {
		fileObjList[fileObjList.length]=key;
	});


	fileLib=.processObjToLib(solution,project,make,fileObjList);

	.writeProjectLocalDependencyLib(solution,project,true);

	make.build(fileLib);
	if(Build.isLocal_) {
		if(Shell.fileExists(fileLib)){
			Shell.copy(fileLib,solution.solutionPath_+"\\"+project.name_+".static.lib");
		};
	};	
};

Platform.buildDll=function(solution,project) {
	var make;
	var fileH;
	var fileHpp;
	var fileC;
	var fileCpp;
	var fileObj;
	var fileObjList;
	var fileDll;
	var fileRc;
	var fileDef;
	var fileRes;

	make=new Make();

	fileH=.getFileCategory(solution,project,"source","h");
	fileHpp=.getFileCategory(solution,project,"source","hpp");
	fileC=.getFileCategory(solution,project,"source","c");
	fileCpp=.getFileCategory(solution,project,"source","cpp");
	fileRc=.getFileCategory(solution,project,"source","rc");

	if(fileH.length) {
		ForEach(fileC,function(key) {
			make.target(fileC[key],fileH,make.cmdTouch,fileC[key]);
		});

		ForEach(fileCpp,function(key) {
			make.target(fileCpp[key],fileH,make.cmdTouch,fileCpp[key]);
		});

		ForEach(fileRc,function(key) {
			make.target(fileRc[key],fileH,make.cmdTouch,fileRc[key]);
		});

	};

	if(fileHpp.length) {
		ForEach(fileCpp,function(key) {
			make.target(fileCpp[key],fileHpp,make.cmdTouch,fileCpp[key]);
		});

		ForEach(fileRc,function(key) {
			make.target(fileRc[key],fileHpp,make.cmdTouch,fileRc[key]);
		});
	};

	fileObj= {};

	ForEach(fileC,function(key) {
		fileObj[Platform.processCToObj(solution,project,make,fileC[key])]=true;
	});

	ForEach(fileCpp,function(key) {
		fileObj[Platform.processCppToObj(solution,project,make,fileCpp[key])]=true;
	});

	ForEach(fileRc,function(key) {
		fileRes=Platform.processRcToRes(solution,project,make,fileRc[key]);
		fileObj[Platform.processResToObj(solution,project,make,fileRes)]=true;
	});

	fileObjList=[];
	ForEach(fileObj,function(key) {
		fileObjList[fileObjList.length]=key;
	});


	fileDll=.processObjToDll(solution,project,make,fileObjList);

	.writeProjectLocalDependencyDll(solution,project,true);

	make.build(fileDll);
	if(Build.isLocal_) {
		if(Shell.fileExists(fileDll)){
			Shell.copy((.buildPath(solution)+"/"+project.name_+".lib").replace("/","\\"),solution.solutionPath_+"\\"+project.name_+".lib");
			Shell.copy(fileDll,solution.solutionPath_+"\\"+project.name_+".dll");
		};
	};
};

Platform.buildExe=function(solution,project) {
	var make;
	var fileH;
	var fileHpp;
	var fileC;
	var fileCpp;
	var fileObj;
	var fileObjList;
	var fileExe;
	var fileRc;
	var fileRes;

	make=new Make();

	fileH=.getFileCategory(solution,project,"source","h");
	fileHpp=.getFileCategory(solution,project,"source","hpp");
	fileC=.getFileCategory(solution,project,"source","c");
	fileCpp=.getFileCategory(solution,project,"source","cpp");
	fileRc=.getFileCategory(solution,project,"source","rc");

	if(fileH.length) {
		ForEach(fileC,function(key) {
			make.target(fileC[key],fileH,make.cmdTouch,fileC[key]);
		});

		ForEach(fileCpp,function(key) {
			make.target(fileCpp[key],fileH,make.cmdTouch,fileCpp[key]);
		});

		ForEach(fileRc,function(key) {
			make.target(fileRc[key],fileH,make.cmdTouch,fileRc[key]);
		});

	};

	if(fileHpp.length) {
		ForEach(fileCpp,function(key) {
			make.target(fileCpp[key],fileHpp,make.cmdTouch,fileCpp[key]);
		});

		ForEach(fileRc,function(key) {
			make.target(fileRc[key],fileHpp,make.cmdTouch,fileRc[key]);
		});
	};

	fileObj= {};

	ForEach(fileC,function(key) {
		fileObj[Platform.processCToObj(solution,project,make,fileC[key])]=true;
	});

	ForEach(fileCpp,function(key) {
		fileObj[Platform.processCppToObj(solution,project,make,fileCpp[key])]=true;
	});

	ForEach(fileRc,function(key) {
		fileRes=Platform.processRcToRes(solution,project,make,fileRc[key]);
		fileObj[Platform.processResToObj(solution,project,make,fileRes)]=true;
	});

	fileObjList=[];
	ForEach(fileObj,function(key) {
		fileObjList[fileObjList.length]=key;
	});


	fileExe=.processObjToExe(solution,project,make,fileObjList);

	.writeProjectLocalDependencyExe(solution,project);

	make.build(fileExe);
	if(Build.isLocal_) {
		if(Shell.fileExists(fileExe)){
			Shell.copy(fileExe,solution.solutionPath_+"\\"+project.name_+".exe");
		};
	};
};


Platform.processCToObj=function(solution,project,make,fileC) {
	var variant;

	variant=Build.getVariant();
	switch(variant) {
		case "release":
			return .processCToObjRelease(solution,project,make,fileC);
			break;
		case "debug":
			return .processCToObjDebug(solution,project,make,fileC);
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process variant '"+variant+"'"));
	};
};

Platform.processCToObjRelease=function(solution,project,make,fileC) {
	var cmd;
	var crtType;
	var optionCategory;
	var fileObj;

	cmd="cl.exe /nologo /O2 /Oi /Oy /GS- /GA /Gy /Gd"+.osExtra;

	crtType=.getOption(solution,project,"crt","type","dynamic");
	switch(crtType) {
		case "static":
			cmd+=" /MT /GL /Gm-";
			break;
		case "dynamic":
			if(.getOption(solution,project,"config","autogenerate-def-file",false)) {
				cmd+=" /MD /GL-";
			} else {
				cmd+=" /MD /GL /Gm-";
			};
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process crt type '"+crtType+"'"));
	};

	if(.getOption(solution,project,"strict","set",false)) {
		cmd+=" /W4 /WX";
	};

	optionCategory=.getOptionCategory(solution,project,"include");
	ForEach(optionCategory,function(key,value) {
		cmd+=" /I\""+key.replace("/","\\")+"\"";
	});

	optionCategory=.getOptionCategory(solution,project,"define");
	ForEach(optionCategory,function(key,value) {
		if(Script.isNil(value)) {
			cmd+=" /D"+key;
			return;
		};
		if(Script.isString(value)) {
			cmd+=" /D"+key+"=\""+value+"\"";
			return;
		};
		cmd+=" /D"+key+"="+value;
	});

	fileObj=(.uniqueBuildFileName(solution,project,fileC,"obj")).replace("/","\\");

	cmd+=" /TC /c /Fo\""+fileObj+"\" \""+fileC.replace("/","\\")+"\"";

	make.target(fileObj,fileC,function(target) {
		Shell.prepareFilePath(target);
		Console.writeLn(this);
		return Shell.system(this);
	},cmd,[fileObj]);

	return fileObj;
};

Platform.processCToObjDebug=function(solution,project,make,fileC) {
	var cmd;
	var crtType;
	var optionCategory;
	var fileObj;
	var filePdb;

	cmd="cl.exe /Zi";

	crtType=.getOption(solution,project,"crt","type","dynamic");
	switch(crtType) {
		case "static":
			cmd+=" /MTd";
			break;
		case "dynamic":
			cmd+=" /MDd";
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process crt type '"+crtType+"'"));
	};

	if(.getOption(solution,project,"strict","set",false)) {
		cmd+=" /W4 /WX";
	};

	optionCategory=.getOptionCategory(solution,project,"include");
	ForEach(optionCategory,function(key,value) {
		cmd+=" /I\""+key.replace("/","\\")+"\"";
	});

	optionCategory=.getOptionCategory(solution,project,"define");
	ForEach(optionCategory,function(key,value) {
		if(Script.isNil(value)) {
			cmd+=" /D"+key;
			return;
		};
		if(Script.isString(value)) {
			cmd+=" /D"+key+"=\""+value+"\"";
			return;
		};
		cmd+=" /D"+key+"="+value;
	});

	fileObj=(.uniqueBuildFileName(solution,project,fileC,"obj")).replace("/","\\");
	filePdb=(.uniqueBuildFileName(solution,project,fileC,"pdb")).replace("/","\\");

	cmd+=" /Fd\""+filePdb+"\"";

	cmd+=" /TC /c /Fo\""+fileObj+"\" \""+fileC.replace("/","\\")+"\"";

	make.target(fileObj,fileC,function(target) {
		Shell.prepareFilePath(target);
		Console.writeLn(this);
		return Shell.system(this);
	},cmd,[fileObj]);

	return fileObj;
};


Platform.processCppToObj=function(solution,project,make,fileCpp) {
	var variant;

	variant=Build.getVariant();
	switch(variant) {
		case "release":
			return .processCppToObjRelease(solution,project,make,fileCpp);
			break;
		case "debug":
			return .processCppToObjDebug(solution,project,make,fileCpp);
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process variant '"+variant+"'"));
	};
};


Platform.processCppToObjRelease=function(solution,project,make,fileCpp) {
	var cmd;
	var crtType;
	var optionCategory;
	var fileObj;

	cmd="cl.exe /nologo /O2 /Oi /Oy /GS- /GA /Gy /Gd"+.osExtra;

	crtType=.getOption(solution,project,"crt","type","dynamic");
	switch(crtType) {
		case "static":
			cmd+=" /MT /GL /Gm-";
			break;
		case "dynamic":
			if(.getOption(solution,project,"config","autogenerate-def-file",false)) {
				cmd+=" /MD /GL-";
			} else {
				cmd+=" /MD /GL /Gm-";
			};
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process crt type '"+crtType+"'"));
	};

	if(.getOption(solution,project,"strict","set",false)) {
		cmd+=" /W4 /WX";
	};

	if(.getOption(solution,project,"cpp","rtti",true)) {
		cmd+=" /EHsc";
	} else {
		cmd+=" /EHsc-";
	};

	if(.getOption(solution,project,"cpp","exceptions",true)) {
		cmd+=" /GR";
	} else {
		cmd+=" /GR-";
	};

	optionCategory=.getOptionCategory(solution,project,"include");
	ForEach(optionCategory,function(key,value) {
		cmd+=" /I\""+key.replace("/","\\")+"\"";
	});

	optionCategory=.getOptionCategory(solution,project,"define");
	ForEach(optionCategory,function(key,value) {
		if(Script.isNil(value)) {
			cmd+=" /D"+key;
			return;
		};
		if(Script.isString(value)) {
			cmd+=" /D"+key+"=\""+value+"\"";
			return;
		};
		cmd+=" /D"+key+"="+value;
	});

	fileObj=(.uniqueBuildFileName(solution,project,fileCpp,"obj")).replace("/","\\");

	cmd+=" /TP /c /Fo\""+fileObj+"\" \""+fileCpp.replace("/","\\")+"\"";

	make.target(fileObj,fileCpp,function(target) {
		Shell.prepareFilePath(target);
		Console.writeLn(this);
		return Shell.system(this);
	},cmd,[fileObj]);

	return fileObj;
};

Platform.processCppToObjDebug=function(solution,project,make,fileCpp) {
	var cmd;
	var crtType;
	var optionCategory;
	var fileObj;
	var filePdb;

	cmd="cl.exe /nologo /Zi";

	crtType=.getOption(solution,project,"crt","type","dynamic");
	switch(crtType) {
		case "static":
			cmd+=" /MTd";
			break;
		case "dynamic":
			cmd+=" /MDd";
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process crt type '"+crtType+"'"));
	};

	if(.getOption(solution,project,"strict","set",false)) {
		cmd+=" /W4 /WX";
	};

	if(.getOption(solution,project,"cpp","rtti",true)) {
		cmd+=" /EHsc";
	} else {
		cmd+=" /EHsc-";
	};

	if(.getOption(solution,project,"cpp","exceptions",true)) {
		cmd+=" /GR";
	} else {
		cmd+=" /GR-";
	};

	optionCategory=.getOptionCategory(solution,project,"include");
	ForEach(optionCategory,function(key,value) {
		cmd+=" /I\""+key+"\"";
	});

	optionCategory=.getOptionCategory(solution,project,"define");
	ForEach(optionCategory,function(key,value) {
		if(Script.isNil(value)) {
			cmd+=" /D"+key;
			return;
		};
		if(Script.isString(value)) {
			cmd+=" /D"+key+"=\""+value+"\"";
			return;
		};
		cmd+=" /D"+key+"="+value;
	});

	fileObj=(.uniqueBuildFileName(solution,project,fileCpp,"obj")).replace("/","\\");
	filePdb=(.uniqueBuildFileName(solution,project,fileCpp,"pdb")).replace("/","\\");

	cmd+=" /Fd\""+filePdb+"\"";

	cmd+=" /TP /c /Fo\""+fileObj+"\" \""+fileCpp.replace("/","\\")+"\"";

	make.target(fileObj,fileCpp,function(target) {
		Shell.prepareFilePath(target);
		Console.writeLn(this);
		return Shell.system(this);
	},cmd,[fileObj]);

	return fileObj;
};

Platform.processObjToLib=function(solution,project,make,fileObjList) {
	var variant;

	variant=Build.getVariant();
	switch(variant) {
		case "release":
			return .processObjToLibRelease(solution,project,make,fileObjList);
			break;
		case "debug":
			return .processObjToLibDebug(solution,project,make,fileObjList);
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process variant '"+variant+"'"));
	};
};

Platform.processObjToLibRelease=function(solution,project,make,fileObjList) {
	var cmd;
	var targetLib;
	var obj2Lib;

	targetLib=(.buildPath(solution)+"/"+project.name_+".static.lib").replace("/","\\");

	cmd="/NOLOGO /OUT:\""+targetLib+"\" /MACHINE:"+.machineType;

	crtType=.getOption(solution,project,"crt","type","dynamic");
	switch(crtType) {
		case "static":
			cmd+=" /LTCG";
			break;
		case "dynamic":
			if(!.getOption(solution,project,"config","autogenerate-def-file",false)) {
				cmd+=" /LTCG";
			};
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process crt type '"+crtType+"'"));
	};

	ForEach(fileObjList,function(key,value) {
		cmd+=" \""+value+"\"";
	});

	obj2Lib=(.buildPath(solution)+"/"+project.name_+".obj2lib").replace("/","\\");

	make.target(targetLib,fileObjList,function(target) {
		Shell.prepareFilePath(target);
		Shell.prepareFilePath(this[1]);
		Shell.filePutContents(this[1],this[0]);
		Console.writeLn(this[2]);
		return Shell.system(this[2]);
	},[cmd,obj2Lib,"lib.exe @"+obj2Lib],[targetLib]);

	return targetLib;
};

Platform.processObjToLibDebug=function(solution,project,make,fileObjList) {
	var cmd;
	var targetLib;
	var obj2Lib;

	targetLib=(.buildPath(solution)+"/"+project.name_+".static.lib").replace("/","\\");

	cmd="/NOLOGO /OUT:\""+targetLib+"\" /MACHINE:"+.machineType;

	crtType=.getOption(solution,project,"crt","type","dynamic");
	switch(crtType) {
		case "static":
			cmd+=" /LTCG";
			break;
		case "dynamic":
			if(!.getOption(solution,project,"config","autogenerate-def-file",false)) {
				cmd+=" /LTCG";
			};
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process crt type '"+crtType+"'"));
	};

	ForEach(fileObjList,function(key,value) {
		cmd+=" \""+value+"\"";
	});

	obj2Lib=(.buildPath(solution)+"/"+project.name_+".obj2lib").replace("/","\\");

	make.target(targetLib,fileObjList,function(target) {
		Shell.prepareFilePath(target);
		Shell.prepareFilePath(this[1]);
		Shell.filePutContents(this[1],this[0]);
		Console.writeLn(this[2]);
		return Shell.system(this[2]);
	},[cmd,obj2Lib,"lib.exe @"+obj2Lib],[targetLib]);

	return targetLib;
};

Platform.processObjToDll=function(solution,project,make,fileObjList) {
	var variant;

	variant=Build.getVariant();
	switch(variant) {
		case "release":
			return .processObjToDllRelease(solution,project,make,fileObjList);
			break;
		case "debug":
			return .processObjToDllDebug(solution,project,make,fileObjList);
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process variant '"+variant+"'"));
	};
};

Platform.processObjToDllRelease=function(solution,project,make,fileObjList) {
	var cmd;
	var targetDll;
	var obj2Dll;
	var fileManifest;
	var fileDef;
	var impLib;
	var generatedDef;
	var sourceList;

	sourceList=[];

	ForEach(fileObjList,function(key,value) {
		sourceList[sourceList.length]=value;
	});

	targetDll=(.buildPath(solution)+"/"+project.name_+".dll").replace("/","\\");

	cmd="/NOLOGO /OUT:\""+targetDll+"\" /MACHINE:"+.machineType+" /DLL /INCREMENTAL:NO /RELEASE /OPT:REF /OPT:ICF";

	if(!.getOption(solution,project,"cpp","exceptions",true)) {
		cmd+=" /SAFESEH:NO";
	};

	crtType=.getOption(solution,project,"crt","type","dynamic");
	switch(crtType) {
		case "static":
			cmd+=" /LTCG /nodefaultlib:msvcrt /defaultlib:libcmt";
			break;
		case "dynamic":
			if(.getOption(solution,project,"config","autogenerate-def-file",false)) {
				cmd+=" /nodefaultlib:libcmt /defaultlib:msvcrt";
			} else {
				cmd+=" /LTCG /nodefaultlib:libcmt /defaultlib:msvcrt";
			};
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process crt type '"+crtType+"'"));
	};

	cmd+=" /ENTRY:"+.getOption(solution,project,"dll","entry",.osDllEntry);

	cmd+=" /LIBPATH:\""+((.buildPath(solution)).replace("/","\\"))+"\"";

	optionCategory=.getOptionCategory(solution,project,"library-path");
	ForEach(optionCategory,function(key,value) {
		cmd+=" /LIBPATH:\""+(key.replace("/","\\"))+"\"";
	});

	impLib=(.buildPath(solution)+"/"+project.name_+".lib").replace("/","\\");

	cmd+=" /implib:\""+impLib+"\"";

	fileDef=.getFileCategory(solution,project,"source","def");

	ForEach(fileDef,function(key,value) {
		sourceList[sourceList.length]=value;
		cmd+=" /DEF:\""+value+"\"";
	});


	if(.getOption(solution,project,"config","autogenerate-def-file",false)) {
		sourceList[sourceList.length]=.processObjToDef(solution,project,make,fileObjList);
		cmd+=" /DEF:\""+sourceList[sourceList.length-1]+"\"";
	};


	ForEach(fileObjList,function(key,value) {
		cmd+=" \""+value+"\"";
	});

	optionCategory=.getOptionCategory(solution,project,"library");
	ForEach(optionCategory,function(key,value) {
		cmd+=" \""+key+".lib\"";
	});

	ForEach(.defaultLibrary,function(key,value) {
		cmd+=" \""+value+".lib\"";
	});

	obj2Dll=(.buildPath(solution)+"/"+project.name_+".obj2dll").replace("/","\\");

	fileManifest=.getFileCategory(solution,project,"source","manifest");

	make.target(targetDll,sourceList,function(target,manifestList) {
		Shell.prepareFilePath(target);
		Shell.prepareFilePath(this[1]);
		Shell.filePutContents(this[1],this[0]);
		if(Shell.cmdX(this[2])) {
			return true;
		};
		ForEach(manifestList,function(key) {
			if(Shell.cmdX("mt.exe -manifest \""+manifestList[key]+"\" -outputresource:\""+target+"\";2")) {
				return true;
			};
		});
		return false;
	},[cmd,obj2Dll,"link.exe @"+obj2Dll],[targetDll,fileManifest]);

	return targetDll;
};

Platform.processObjToDllDebug=function(solution,project,make,fileObjList) {
	var cmd;
	var targetDll;
	var obj2Dll;
	var fileManifest;
	var fileDef;
	var impLib;
	var generatedDef;
	var sourceList;

	sourceList=[];

	ForEach(fileObjList,function(key,value) {
		sourceList[sourceList.length]=value;
	});

	targetDll=(.buildPath(solution)+"/"+project.name_+".dll").replace("/","\\");

	cmd="/NOLOGO /OUT:\""+targetDll+"\" /MACHINE:"+.machineType+" /DLL /DEBUG";

	if(!.getOption(solution,project,"cpp","exceptions",true)) {
		cmd+=" /SAFESEH:NO";
	};

	crtType=.getOption(solution,project,"crt","type","dynamic");
	switch(crtType) {
		case "static":
			cmd+=" /nodefaultlib:msvcrtd /defaultlib:libcmtd";
			break;
		case "dynamic":
			if(.getOption(solution,project,"config","autogenerate-def-file",false)) {
				cmd+=" /nodefaultlib:libcmt /defaultlib:msvcrt";
			} else {
				cmd+=" /nodefaultlib:libcmtd /defaultlib:msvcrtd";
			};
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process crt type '"+crtType+"'"));
	};

	cmd+=" /ENTRY:"+.getOption(solution,project,"dll","entry",.osDllEntry);

	cmd+=" /LIBPATH:\""+((.buildPath(solution)).replace("/","\\"))+"\"";

	optionCategory=.getOptionCategory(solution,project,"library-path");
	ForEach(optionCategory,function(key,value) {
		cmd+=" /LIBPATH:\""+(key.replace("/","\\"))+"\"";
	});

	impLib=(.buildPath(solution)+"/"+project.name_+".lib").replace("/","\\");

	cmd+=" /implib:\""+impLib+"\"";

	fileDef=.getFileCategory(solution,project,"source","def");

	ForEach(fileDef,function(key,value) {
		sourceList[sourceList.length]=value;
		cmd+=" /DEF:\""+value+"\"";
	});

	if(.getOption(solution,project,"config","autogenerate-def-file",false)) {
		sourceList[sourceList.length]=.processObjToDef(solution,project,make,fileObjList);
		cmd+=" /DEF:\""+sourceList[sourceList.length-1]+"\"";
	};

	ForEach(fileObjList,function(key,value) {
		cmd+=" \""+value+"\"";
	});

	optionCategory=.getOptionCategory(solution,project,"library");
	ForEach(optionCategory,function(key,value) {
		cmd+=" \""+key+".lib\"";
	});

	ForEach(.defaultLibrary,function(key,value) {
		cmd+=" \""+value+".lib\"";
	});

	obj2Dll=(.buildPath(solution)+"/"+project.name_+".obj2dll").replace("/","\\");

	fileManifest=.getFileCategory(solution,project,"source","manifest");

	make.target(targetDll,sourceList,function(target,manifestList) {
		Shell.prepareFilePath(target);
		Shell.prepareFilePath(this[1]);
		Shell.filePutContents(this[1],this[0]);
		if(Shell.cmdX(this[2])) {
			return true;
		};
		ForEach(manifestList,function(key) {
			if(Shell.cmdX("mt.exe -manifest \""+manifestList[key]+"\" -outputresource:\""+target+"\";2")) {
				return true;
			};
		});
		return false;
	},[cmd,obj2Dll,"link.exe @"+obj2Dll],[targetDll,fileManifest]);

	return targetDll;
};


Platform.processRcToRes=function(solution,project,make,fileRc) {
	var cmd;
	var optionCategory;
	var fileRes;

	cmd="rc.exe /nologo ";

	optionCategory=.getOptionCategory(solution,project,"include");
	ForEach(optionCategory,function(key,value) {
		cmd+=" /i \""+key+"\"";
	});

	optionCategory=.getOptionCategory(solution,project,"define");
	ForEach(optionCategory,function(key,value) {
		if(Script.isNil(value)) {
			cmd+=" /d "+key;
			return;
		};
		if(Script.isString(value)) {
			cmd+=" /d "+key+"=\""+value+"\"";
			return;
		};
		cmd+=" /d "+key+"="+value;
	});

	fileRes=(.uniqueBuildFileName(solution,project,fileRc,"res")).replace("/","\\");

	cmd+=" /l 409 /z \"MS Sans Serif,Helv/MS Shell Dlg\" /r /fo \""+fileRes+"\" \""+fileRc+"\"";

	make.target(fileRes,fileRc,function(target) {
		Shell.prepareFilePath(target);
		Console.writeLn(this);
		return Shell.system(this);
	},cmd,[fileRes]);

	return fileRes;
};

Platform.processResToObj=function(solution,project,make,fileRes) {
	var cmd;
	var fileObj;

	fileObj=(Shell.getFileBasename(fileRes)+".obj").replace("/","\\");

	cmd="cvtres.exe /NOLOGO /MACHINE:"+.machineType+" /OUT:\""+fileObj+"\" \""+fileRes+"\"";

	make.target(fileObj,fileRes,function(target) {
		Shell.prepareFilePath(target);
		Console.writeLn(this);
		return Shell.system(this);
	},cmd,[fileObj]);

	return fileObj;
};


Platform.processObjToDef=function(solution,project,make,fileObjList) {
	var cmd;
	var fileDef;
	var fileCoff2Def;
	var content;

	fileDef=(.buildPath(solution)+"/"+project.name_+".generated.def").replace("/","\\");
	fileCoff2Def=(.buildPath(solution)+"/"+project.name_+".coff2def").replace("/","\\");

	cmd="xyo-coff-to-def.exe --mode "+.osType+" --out \""+fileDef+"\"";

	content="";
	ForEach(fileObjList,function(key,value) {
		content+=value+"\n";
	});

	cmd+=" \"@"+fileCoff2Def+"\"";

	make.target(fileDef,fileObjList,function() {
		Shell.filePutContents(this[2],this[1]);
		Console.writeLn(this[0]);
		return Shell.system(this[0]);
	},[cmd,content,fileCoff2Def]);

	return fileDef;
};

Platform.processObjToExe=function(solution,project,make,fileObjList) {
	var variant;

	variant=Build.getVariant();
	switch(variant) {
		case "release":
			return .processObjToExeRelease(solution,project,make,fileObjList);
			break;
		case "debug":
			return .processObjToExeDebug(solution,project,make,fileObjList);
			break;
		default:
			throw(new BuildError("Platform: Unknow how to process variant '"+variant+"'"));
	};
};

Platform.processObjToExeRelease=function(solution,project,make,fileObjList) {
	var cmd;
	var targetExe;
	var obj2Exe;
	var fileManifest;
	var optionCategory;

	targetExe=(.buildPath(solution)+"/"+project.name_+".exe").replace("/","\\");

	cmd="/NOLOGO /OUT:\""+targetExe+"\" /MACHINE:"+.machineType+" /INCREMENTAL:NO /RELEASE /OPT:REF /OPT:ICF /LTCG";

	if(!.getOption(solution,project,"cpp","exceptions",true)) {
		cmd+=" /SAFESEH:NO";
	};

	cmd+=" /LIBPATH:\""+((.buildPath(solution)).replace("/","\\"))+"\"";

	optionCategory=.getOptionCategory(solution,project,"library-path");
	ForEach(optionCategory,function(key,value) {
		cmd+=" /LIBPATH:\""+(key.replace("/","\\"))+"\"";
	});

	ForEach(fileObjList,function(key,value) {
		cmd+=" \""+value+"\"";
	});

	optionCategory=.getOptionCategory(solution,project,"library");
	ForEach(optionCategory,function(key,value) {
		cmd+=" \""+key+".lib\"";
	});

	ForEach(.defaultLibrary,function(key,value) {
		cmd+=" \""+value+".lib\"";
	});

	obj2Exe=(.buildPath(solution)+"/"+project.name_+".obj2exe").replace("/","\\");

	fileManifest=.getFileCategory(solution,project,"source","manifest");

	make.target(targetExe,fileObjList,function(target,manifestList) {
		Shell.prepareFilePath(target);
		Shell.prepareFilePath(this[1]);
		Shell.filePutContents(this[1],this[0]);
		if(Shell.cmdX(this[2])) {
			return true;
		};
		ForEach(manifestList,function(key) {
			if(Shell.cmdX("mt.exe -manifest \""+manifestList[key]+"\" -outputresource:\""+target+"\";1")) {
				return true;
			};
		});
		return false;
	},[cmd,obj2Exe,"link.exe @"+obj2Exe],[targetExe,fileManifest]);

	return targetExe;
};

Platform.processObjToExeDebug=function(solution,project,make,fileObjList) {
	var cmd;
	var targetExe;
	var obj2Exe;
	var fileManifest;
	var optionCategory;

	targetExe=(.buildPath(solution)+"/"+project.name_+".exe").replace("/","\\");

	cmd="/NOLOGO /OUT:\""+targetExe+"\" /MACHINE:"+.machineType+" /INCREMENTAL:NO /DEBUG /OPT:REF /OPT:ICF";

	if(!.getOption(solution,project,"cpp","exceptions",true)) {
		cmd+=" /SAFESEH:NO";
	};

	cmd+=" /LIBPATH:\""+((.buildPath(solution)).replace("/","\\"))+"\"";

	optionCategory=.getOptionCategory(solution,project,"library-path");
	ForEach(optionCategory,function(key,value) {
		cmd+=" /LIBPATH:\""+(key.replace("/","\\"))+"\"";
	});

	ForEach(fileObjList,function(key,value) {
		cmd+=" \""+value+"\"";
	});

	optionCategory=.getOptionCategory(solution,project,"library");
	ForEach(optionCategory,function(key,value) {
		cmd+=" \""+key+".lib\"";
	});

	ForEach(.defaultLibrary,function(key,value) {
		cmd+=" \""+value+".lib\"";
	});

	obj2Exe=(.buildPath(solution)+"/"+project.name_+".obj2exe").replace("/","\\");

	fileManifest=.getFileCategory(solution,project,"source","manifest");

	make.target(targetExe,fileObjList,function(target,manifestList) {
		Shell.prepareFilePath(target);
		Shell.prepareFilePath(this[1]);
		Shell.filePutContents(this[1],this[0]);
		if(Shell.cmdX(this[2])) {
			return true;
		};
		ForEach(manifestList,function(key) {
			if(Shell.cmdX("mt.exe -manifest \""+manifestList[key]+"\" -outputresource:\""+target+"\";1")) {
				return true;
			};
		});
		return false;
	},[cmd,obj2Exe,"link.exe @"+obj2Exe],[targetExe,fileManifest]);

	return targetExe;
};


Platform.is=function(os) {
	if(os=="win") {
		return true;
	};
	if(os=="win32") {
		return true;
	};
	return false;
};

Platform.isCompiler=function(compiler) {
	if(compiler=="msvc") {
		return true;
	};
	return false;
};

Platform.loadProjectLocalDependency=function(solution,project,projectName,projectType) {
	var load_;
	var file;

	file=.buildPath(solution)+"/"+solution.name_+"."+projectName+"."+projectType+".local.dependency.js";

	if(!Shell.fileExists(file)) {
		throw(new BuildError("Platform: dependency "+solution.name_+"."+projectName+"."+projectType+" not found!"));
	};

	Script.include.call(project,file);
};

Platform.loadProjectDependency=function(solution,project,solutionName,projectName,projectType) {
	var load_;
	var file;

	file=.pathDependency()+"/"+solutionName+"."+projectName+"."+projectType+".dependency.js";

	if(!Shell.fileExists(file)) {
		throw(new BuildError("Platform: dependency "+solutionName+"."+projectName+"."+projectType+" not found!"));
	};

	Script.include.call(project,file);
};

Platform.writeProjectLocalDependencyExe=function(solution,project) {
	var file;
	var content;

	content="";

	file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+".exe.local.dependency.js";
	content+=".option(\"path\",Platform.buildPathX(\""+solution.name_+"\",\""+Build.variant_+"\"));\n";
	content+=.processDependencyOption(solution,project,mode,true);
	content+=.processDependencyProject(solution,project);
	content+=.processDependency(solution,project);
	content+=.processDependencyLocalLicence(solution,project);
	content+="\n";
	Shell.prepareFilePath(file);
	Shell.filePutContents(file,content);
};

Platform.writeProjectLocalDependencyDll=function(solution,project,full) {
	var file;
	var content;

	content="";

	file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+".dll.local.dependency.js";
	content+=".option(\"library-path\",Platform.buildPathX(\""+solution.name_+"\",\""+Build.variant_+"\"));\n";
	content+=".option(\"include\",Platform.buildPathX(\""+solution.name_+"\",\""+Build.variant_+"\"));\n";
	if(full){
		content+=".option(\"library\",\""+project.name_+"\");\n";
	};
	content+=.processDependencyOption(solution,project,mode,true);
	content+=.processDependencyProject(solution,project);
	content+=.processDependency(solution,project);
	content+=.processDependencyLocalLicence(solution,project);
	content+="\n";
	Shell.prepareFilePath(file);
	Shell.filePutContents(file,content);
};

Platform.writeProjectLocalDependencyLib=function(solution,project,full) {
	var file;
	var content;

	content="";

	file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+".lib.local.dependency.js";
	content+=".option(\"library-path\",Platform.buildPathX(\""+solution.name_+"\",\""+Build.variant_+"\"));\n";
	content+=".option(\"include\",Platform.buildPathX(\""+solution.name_+"\",\""+Build.variant_+"\"));\n";
	if(full){
		content+=".option(\"library\",\""+project.name_+".static\");\n";
	};
	content+=.processDependencyOption(solution,project,mode,true);
	content+=.processDependencyProject(solution,project);
	content+=.processDependency(solution,project);
	content+=.processDependencyLocalLicence(solution,project);
	content+="\n";
	Shell.prepareFilePath(file);
	Shell.filePutContents(file,content);
};

Platform.writeProjectLocalDependencyProcess=function(solution,project) {
	var file;
	var content;

	content="";

	file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+".process.local.dependency.js";
	content+=.processDependencyOption(solution,project,mode,true);
	content+=.processDependencyProject(solution,project);
	content+=.processDependency(solution,project);
	content+=.processDependencyLocalLicence(solution,project);
	content+="\n";
	Shell.prepareFilePath(file);
	Shell.filePutContents(file,content);
};

Platform.writeProjectDependencyExe=function(solution,project,mode) {
	var file;
	var content;

	content="";

	file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+".exe.dependency.js";
	content+=".option(\"path\",Platform.installPathX(\""+solution.name_+"\",\""+mode+"\")+\"/bin\");\n";
	content+=.processDependencyOption(solution,project,mode,false);
	content+=.processDependency(solution,project);
	content+=.processDependencyLicence(solution,project);
	content+="\n";
	Shell.prepareFilePath(file);
	Shell.filePutContents(file,content);
};

Platform.writeProjectDependencyDll=function(solution,project,mode,full) {
	var file;
	var content;

	content="";

	file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+".dll.dependency.js";
	content+=".option(\"path\",Platform.installPathX(\""+solution.name_+"\",\""+mode+"\")+\"/bin\");\n";
	content+=".option(\"library-path\",Platform.installPathX(\""+solution.name_+"\",\""+mode+"\")+\"/lib\");\n";
	content+=".option(\"include\",Platform.installPathX(\""+solution.name_+"\",\""+mode+"\")+\"/include\");\n";
	if(full){
		content+=".option(\"library\",\""+project.name_+"\");\n";
	};
	content+=.processDependencyOption(solution,project,mode,false);
	content+=.processDependency(solution,project);
	content+=.processDependencyLicence(solution,project);
	content+="\n";
	Shell.prepareFilePath(file);
	Shell.filePutContents(file,content);
};

Platform.writeProjectDependencyLib=function(solution,project,mode,full) {
	var file;
	var content;

	content="";

	file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+".lib.dependency.js";
	content+=".option(\"library-path\",Platform.installPathX(\""+solution.name_+"\",\""+mode+"\")+\"/lib\");\n";
	content+=".option(\"include\",Platform.installPathX(\""+solution.name_+"\",\""+mode+"\")+\"/include\");\n";
	if(full){
		content+=".option(\"library\",\""+project.name_+".static\");\n";
	};
	content+=.processDependencyOption(solution,project,mode,false);
	content+=.processDependency(solution,project);
	content+=.processDependencyLicence(solution,project);
	content+="\n";
	Shell.prepareFilePath(file);
	Shell.filePutContents(file,content);
};

Platform.writeProjectDependencyProcess=function(solution,project,mode) {
	var file;
	var content;

	content="";

	file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+".process.dependency.js";
	content+=.processDependencyOption(solution,project,mode,false);
	content+=.processDependency(solution,project);
	content+=.processDependencyLicence(solution,project);
	content+="\n";
	Shell.prepareFilePath(file);
	Shell.filePutContents(file,content);
};

Platform.projectTypeX=function(type_) {
	switch(type_) {
		case "dependency-lib":
			return "lib";
			break;
		case "dependency-dll":
			return "dll";
			break;
		case "dependency-exe":
			return "exe";
			break;
		case "dependency-process":
			return "process";
			break;
		case "private-lib":
			return "lib";
			break;
		case "private-dll":
			return "dll";
			break;
		case "private-exe":
			return "exe";
			break;
		case "private-process":
			return "process";
			break;
	};
	return type_;
};


Platform.processDependencyLocalLicence=function(solution,project) {
	var content;
	var licenceFile;
	var licenceContent;
	var file;
	var found;
	var licenceList;
	var contentX;
	var typeX;

	typeX=.projectTypeX(project.type_);


	content="";
	licenceContent="";

	found=false;

	licenceFile=.getOptionCategory(solution,project,"licence-file");
	ForEach(licenceFile,function(key,value) {
		licenceContent+=Shell.fileGetContents(key.replace("/","\\"));
		licenceContent+="\n\n";
		found=true;
	});

	if(found) {
		file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+"."+typeX+".local.licence.txt";
		Shell.prepareFilePath(file);
		Shell.filePutContents(file,licenceContent);
		content+=".option(\"licence-dependency\",\""+solution.name_+"."+project.name_+"."+typeX+"\");";
	};

	contentX="";
	licenceList=.getOptionCategory(solution,project,"licence");
	ForEach(licenceList,function(key,value) {
		if(contentX.length) {
			contentX+=", ";
		};
		contentX+="\""+key+"\"";
	});
	if(contentX.length) {
		content+=".option(\"licence-list\",\""+solution.name_+"."+project.name_+"."+typeX+"\",["+contentX+"]);";
	} else {
		content+=".option(\"licence-list\",\""+solution.name_+"."+project.name_+"."+typeX+"\",null);";
	};

	return content;
};

Platform.processDependencyLicence=function(solution,project) {
	var content;
	var licenceFile;
	var licenceContent;
	var file;
	var found;
	var licenceList;
	var contentX;
	var typeX;


	typeX=.projectTypeX(project.type_);

	content="";
	licenceContent="";

	found=false;
	licenceFile=.getOptionCategory(solution,project,"licence-file");
	ForEach(licenceFile,function(key,value) {
		licenceContent+=Shell.fileGetContents(key.replace("/","\\"));
		licenceContent+="\n\n";
		found=true;
	});

	if(found) {
		file=.buildPath(solution)+"/"+solution.name_+"."+project.name_+"."+typeX+".licence.txt";
		Shell.prepareFilePath(file);
		Shell.filePutContents(file,licenceContent);

		content+=".option(\"licence-dependency\",\""+solution.name_+"."+project.name_+"."+typeX+"\");";

	};


	contentX="";
	licenceList=.getOptionCategory(solution,project,"licence");
	ForEach(licenceList,function(key,value) {
		if(contentX.length) {
			contentX+=", ";
		};
		contentX+="\""+key+"\"";
	});
	if(contentX.length) {
		content+=".option(\"licence-list\",\""+solution.name_+"."+project.name_+"."+typeX+"\",["+contentX+"]);";
	} else {
		content+=".option(\"licence-list\",\""+solution.name_+"."+project.name_+"."+typeX+"\",null);";
	};

	return content;
};


Platform.processDependencyOption=function(solution,project,mode,isLocal) {
	var content;
	content="";
	var list= {};

	ForEach(solution.dependencyOption_,function(key,value) {
		if(Script.isNil(list[key])) {
			list[key]= {};
		};
		ForEach(value,function(keyX,valueX) {
			list[key][keyX]=valueX;
		});
	});

	ForEach(project.dependencyOption_,function(key,value) {
		if(Script.isNil(list[key])) {
			list[key]= {};
		};
		ForEach(value,function(keyX,valueX) {
			list[key][keyX]=valueX;
		});
	});

	ForEach(list,function(key,value) {

		if(key=="install-include") {
			if(!isLocal) {
				ForEach(value,function(keyX,valueX) {
					content+=".option(\"include\",Platform.installPathX(\""+solution.name_+"\",\""+mode+"\")+\"/include/"+keyX+"\");\n";
				},this);
			};
			continue;
		};

		ForEach(value,function(keyX,valueX) {
			if(Script.isNil(valueX)) {
				content+=".option(\""+key+"\",\""+keyX+"\");\n";
				return;
			};
			if(Script.isString(valueX)) {
				content+=".option(\""+key+"\",\""+keyX+"\",\""+valueX+"\");\n";
				return;
			};
			content+=".option(\""+key+"\",\""+keyX+"\","+valueX+");\n";
		},this);
	},this);

	return content;
};

Platform.processDependencyProject=function(solution,project) {
	var content;
	content="";

	ForEach(project.dependencyProject_,function(key, value) {
		ForEach(value,function(keyX,valueX) {
			content+=".privateDependencyProject(\""+key+"\",\""+keyX+"\");\n";
		});
	});

	return content;
};


Platform.processDependency=function(solution,project) {
	var content;
	content="";

	ForEach(project.dependency_,function(key, value) {
		ForEach(value,function(keyX,valueX) {
			ForEach(valueX,function(keyT,valueT) {
				content+=".privateDependency(\""+key+"\",\""+keyX+"\",\""+keyT+"\");\n";
			});
		});
	});

	return content;
};


Platform.installLib=function(solution,project,mode,full) {
	var installPath;
	var buildPath;
	.beginInstall();
	.writeProjectDependencyLib(solution,project,mode,full);
	installPath=.installPathX(solution.name_,mode);
	buildPath=.buildPath(solution);

	.installCopyFile(
		buildPath+"/"+solution.name_+"."+project.name_+".lib.dependency.js",
		.pathDependency()+"/"+solution.name_+"."+project.name_+".lib.dependency.js"
	);

	if(full) {
		.installCopyFile(
			buildPath+"/"+project.name_+".static.lib",
			installPath+"/lib/"+project.name_+".static.lib"
		);
	};

	.installProject_(solution,project,mode);
	.endInstall(solution,project);
};

Platform.installDll=function(solution,project,mode,full) {
	var installPath;
	var buildPath;
	.beginInstall();
	.writeProjectDependencyDll(solution,project,mode,full);
	installPath=.installPathX(solution.name_,mode);
	buildPath=.buildPath(solution);
	.installCopyFile(
		buildPath+"/"+solution.name_+"."+project.name_+".dll.dependency.js",
		.pathDependency()+"/"+solution.name_+"."+project.name_+".dll.dependency.js"
	);
	if(full) {
		.installCopyFile(
			buildPath+"/"+project.name_+".lib",
			installPath+"/lib/"+project.name_+".lib"
		);
		.installCopyFile(
			buildPath+"/"+project.name_+".dll",
			installPath+"/bin/"+project.name_+".dll"
		);
	};
	.installProject_(solution,project,mode);
	.endInstall(solution,project);
};

Platform.installExe=function(solution,project,mode,full) {
	var installPath;
	var buildPath;
	.beginInstall();
	.writeProjectDependencyExe(solution,project,mode);
	installPath=.installPathX(solution.name_,mode);
	buildPath=.buildPath(solution);
	.installCopyFile(
		buildPath+"/"+solution.name_+"."+project.name_+".exe.dependency.js",
		.pathDependency()+"/"+solution.name_+"."+project.name_+".exe.dependency.js"
	);
	if(full) {
		.installCopyFile(
			buildPath+"/"+project.name_+".exe",
			installPath+"/bin/"+project.name_+".exe"
		);
	};
	.installProject_(solution,project,mode);
	.endInstall(solution,project);
};

Platform.installProject=function(solution,project,mode,full) {
	.beginInstall();
	.writeProjectDependencyProcess(solution,project,mode);
	.installProject_(solution,project,mode);
	.endInstall(solution,project);
};


Platform.beginInstall=function() {
	.installFileList=[];
};

Platform.endInstall=function(solution,project) {
	var content;
	var file;
	var typeX;


	typeX=.projectTypeX(project.type_);


	file=(.pathUninstall()+"\\"+solution.name_+"."+project.name_+"."+typeX+".uninstall.js").replace("/","\\");
	.installFileList[.installFileList.length]=file;

	content="// Automatically generated by XYO Build\n\n";
	ForEach(.installFileList,function(key,value) {
		content+="Shell.removeFileAndDirectoryIfEmpty(\""+value.replace("\\","\\\\")+"\");\n";
	});
	content+="\n";

	Shell.prepareFilePath(file);
	Shell.filePutContents(file,content);
};

Platform.installCopyFile=function(source,target) {
	.installFileList[.installFileList.length]=target.replace("/","\\");
	Shell.prepareFilePath(target.replace("/","\\"));
	Shell.copy(source.replace("/","\\"),target.replace("/","\\"));
};

Platform.installCopyFileToDirectory=function(source,target) {
	var list;

	Shell.preparePath(target.replace("/","\\"));
	list=Shell.getFileList(source.replace("/","\\"));
	ForEach(list,function(key,value) {
		Shell.copy(value,target.replace("/","\\")+"\\"+Shell.getFileName(value));
		.installFileList[.installFileList.length]=target.replace("/","\\")+"\\"+Shell.getFileName(value);
	},this);
};

Platform.installCopyDirectory=function(source,target) {
	Shell.prepareFilePath(target.replace("/","\\"));
	.installCopyDirRecursively(source.replace("/","\\"),target.replace("/","\\"));
	.installFileList[.installFileList.length]=target.replace("/","\\")+"\\.dummy";
};

Platform.installCopyDirRecursively=function(source,target) {
	.installCopyDirRecursively_1(source,target,source);
};

Platform.installCopyDirRecursively_1=function(source,target,base_) {
	var dirList;
	var fileList;
	var k;
	var m;
	var find;
	var find_;

	dirList=[];
	fileList=[];
	k=0;
	m=0;
	find_=source+"/*";

	for(find=ShellFind(find_); find.isValid(); find.next()) {
		if(find.isDirectory()) {
			if(find.name()=="..") {
			} else if(find.name()==".") {
			} else {
				dirList[k]=source+"/"+find.name();
				++k;
			};
		} else {
			fileList[m]=source+"/"+find.name();
			++m;
		};
	};

	for(k=0; k<dirList.length; ++k) {
		Shell.copyDirRecursively_1(dirList[k],target,base_);
	};

	Shell.mkdirRecursively(target+source.substring(base_.length));

	for(m=0; m<fileList.length; ++m) {
		.installFileList[.installFileList.length]=(target+fileList[m].substring(base_.length)).replace("/","\\");
		Shell.copy(fileList[m],target+fileList[m].substring(base_.length));
	};
	.installFileList[.installFileList.length]=(target+source.substring(base_.length)).replace("/","\\")+"\\.dummy";
};


Platform.installProject_=function(solution,project,mode) {
	var fileX;
	var installPath;

	installPath=.installPathX(solution.name_,mode);

	fileX=.getInstallCategory(solution,project,"include");
	ForEach(fileX,function(key,value) {
		if(Script.isNil(value)) {
			.installCopyFileToDirectory(key,installPath+"\\include");
		} else if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyFileToDirectory(key,installPath+"\\include\\"+valueX);
			},this);
			.installFileList[.installFileList.length]=(installPath+"\\include\\.dummy").replace("/","\\");
		} else {
			.installCopyFileToDirectory(key,installPath+"\\include\\"+value);
			.installFileList[.installFileList.length]=(installPath+"\\include\\.dummy").replace("/","\\");
		};
	},this);
	fileX=.getInstallCategory(solution,project,"lib");
	ForEach(fileX,function(key,value) {
		if(Script.isNil(value)) {
			.installCopyFileToDirectory(key,installPath+"\\lib");
		} else if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyFileToDirectory(key,installPath+"\\lib\\"+valueX);
			},this);
			.installFileList[.installFileList.length]=(installPath+"\\lib\\.dummy").replace("/","\\");
		} else {
			.installCopyFileToDirectory(key,installPath+"\\lib\\"+value);
			.installFileList[.installFileList.length]=(installPath+"\\lib\\.dummy").replace("/","\\");
		};
	},this);
	fileX=.getInstallCategory(solution,project,"bin");
	ForEach(fileX,function(key,value) {
		if(Script.isNil(value)) {
			.installCopyFileToDirectory(key,installPath+"\\bin");
		} else if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyFileToDirectory(key,installPath+"\\bin\\"+valueX);
			},this);
			.installFileList[.installFileList.length]=(installPath+"\\bin\\.dummy").replace("/","\\");
		} else {
			.installCopyFileToDirectory(key,installPath+"\\bin\\"+value);
			.installFileList[.installFileList.length]=(installPath+"\\bin\\.dummy").replace("/","\\");
		};
	},this);
	fileX=.getInstallCategory(solution,project,"licence");
	ForEach(fileX,function(key,value) {
		if(Script.isNil(value)) {
			.installCopyFileToDirectory(key,installPath+"\\licence");
		} else if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyFileToDirectory(key,installPath+"\\licence\\"+valueX);
			},this);
			.installFileList[.installFileList.length]=(installPath+"\\licence\\.dummy").replace("/","\\");
		} else {
			.installCopyFileToDirectory(key,installPath+"\\licence\\"+value);
			.installFileList[.installFileList.length]=(installPath+"\\licence\\.dummy").replace("/","\\");
		};
	},this);
	fileX=.getInstallCategory(solution,project,"install");
	ForEach(fileX,function(key,value) {
		if(Script.isNil(value)) {
			.installCopyFileToDirectory(key,installPath);
		} else if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyFileToDirectory(key,installPath+"\\"+valueX);
			},this);
			.installFileList[.installFileList.length]=(installPath+"\\.dummy").replace("/","\\");
		} else {
			.installCopyFileToDirectory(key,installPath+"\\"+value);
			.installFileList[.installFileList.length]=(installPath+"\\.dummy").replace("/","\\");
		};
	},this);
	fileX=.getInstallCategoryX(solution,project,"file");
	ForEach(fileX,function(key,value) {
		if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyFile(key,installPath+"/"+valueX);
			},this);
		} else {
			.installCopyFile(key,installPath+"/"+value);
		};
	},this);
	fileX=.getInstallCategoryX(solution,project,"directory");
	ForEach(fileX,function(key,value) {
		if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyDirectory(key,installPath+"/"+valueX);
				.installFileList[.installFileList.length]=(installPath+"\\"+valueX+"\\.dummy").replace("/","\\");
			},this);
		} else {
			.installCopyDirectory(key,installPath+"/"+value);
			.installFileList[.installFileList.length]=(installPath+"\\"+value+"\\.dummy").replace("/","\\");
		};
	},this);
	fileX=.getInstallCategory(solution,project,"build");
	ForEach(fileX,function(key,value) {
		if(Script.isNil(value)) {
			.installCopyFileToDirectory(.buildPath(solution)+"/"+key,installPath);
		} else if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyFileToDirectory(.buildPath(solution)+"/"+key,installPath+"\\"+valueX);
			},this);
			.installFileList[.installFileList.length]=(installPath+"\\.dummy").replace("/","\\");
		} else {
			.installCopyFileToDirectory(.buildPath(solution)+"/"+key,installPath+"\\"+value);
			.installFileList[.installFileList.length]=(installPath+"\\.dummy").replace("/","\\");
		};
	},this);
	fileX=.getInstallCategoryX(solution,project,"build-file");
	ForEach(fileX,function(key,value) {
		if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyFile(.buildPath(solution)+"/"+key,installPath+"/"+valueX);
			},this);
		} else {
			.installCopyFile(.buildPath(solution)+"/"+key,installPath+"/"+value);
		};
	},this);
	fileX=.getInstallCategoryX(solution,project,"build-directory");
	ForEach(fileX,function(key,value) {
		if(Script.isArray(value)) {
			ForEach(value,function(keyX,valueX) {
				.installCopyDirectory(.buildPath(solution)+"/"+key,installPath+"/"+valueX);
				.installFileList[.installFileList.length]=(installPath+"\\"+valueX+"\\.dummy").replace("/","\\");
			},this);
		} else {
			.installCopyDirectory(.buildPath(solution)+"/"+key,installPath+"/"+value);
			.installFileList[.installFileList.length]=(installPath+"\\"+value+"\\.dummy").replace("/","\\");
		};
	},this);
	fileX=.buildPath(solution)+"/"+solution.name_+"."+project.name_+"."+project.type_+".licence.txt";
	if(Shell.fileExists(fileX)) {
		.installCopyFile(
			fileX,
			.pathDependency()+"/"+solution.name_+"."+project.name_+"."+project.type_+".licence.txt"
		);
	};

	.installFileList[.installFileList.length]=(installPath+"\\.dummy").replace("/","\\");
};

Platform.buildClean=function(solution,project) {
	Shell.removeDirRecursively(.buildPath(solution));
	if(Build.isLocal_){
		var type_=.projectTypeX(project.type_);
		if(type_=="lib"){
			Shell.remove(solution.solutionPath_+"\\"+project.name_+".static.lib");			
			return;
		};	
		if(type_=="dll"){
			Shell.remove(solution.solutionPath_+"\\"+project.name_+".lib");
			Shell.remove(solution.solutionPath_+"\\"+project.name_+".dll");
			return;
		};	
		if(type_=="exe"){
			Shell.remove(solution.solutionPath_+"\\"+project.name_+".exe");
			return;
		};	
	};
};

Platform.uninstallProject=function(solution,project) {
	var file;
	file=.pathUninstall()+"\\"+solution.name_+"."+project.name_+"."+project.type_+".uninstall.js";
	if(Shell.fileExists(file)) {
		try {
			Script.include.call(this,file);
		} catch(e) {};
	};
};

Platform.versionProject=function(solution,project) {
	var optionCategory;

	ForEach(.getOptionCategory(solution,project,"version"),function(key,value) {
		if(key=="xyo-version") {

			if(Script.isNil(value)) {
				.sysCmd("xyo-version.exe --app "+project.name_);
			} else if(Script.isObject(value)) {
				if(value.type=="xyo-cpp") {
					if(Script.isNil(value.codeExport)) {
						value.codeExport="";
					};
					if(!Script.isNil(value.lineBegin)) {
						.sysCmd("xyo-version.exe --xyo-cpp --app "+project.name_+" --source-begin-base64 \""+Base64.encode(value.sourceBegin)+"\" --source-end-base64 \""+Base64.encode(value.sourceEnd)+"\" --line-begin-base64 \""+Base64.encode(value.lineBegin)+"\" --code-export-base64 \""+Base64.encode(value.codeExport)+"\"");
					} else {
						.sysCmd("xyo-version.exe --xyo-cpp --app "+project.name_+" --source-begin-base64 \""+Base64.encode(value.sourceBegin)+"\" --source-end-base64 \""+Base64.encode(value.sourceEnd)+"\" --code-export-base64 \""+Base64.encode(value.codeExport)+"\"");
					};
				};
			} else if(value=="cpp") {
				.sysCmd("xyo-version.exe --xyo-cpp --app "+project.name_);
			} else if(value=="c") {
				.sysCmd("xyo-version.exe --xyo-c --app "+project.name_);
			};

		};
	},this);
};

Platform.digitalSignExe=function(solution,project) {
	var optionCategory;
	var cmd;
	var file;
	ForEach(.getOptionCategory(solution,project,"sign"),function(key,value) {
		cmd="sign-"+key;
		file=.buildPath(solution)+"/"+project.name_+".exe";
		cmd+=" \""+project.name_+"\" \""+file.replace("/","\\")+"\"";
		.sysCmd(cmd);
	},this);
};

Platform.digitalSignDll=function(solution,project) {
	var optionCategory;
	var cmd;
	var file;
	ForEach(.getOptionCategory(solution,project,"sign"),function(key,value) {
		cmd="sign-"+key;
		file=.buildPath(solution)+"/"+project.name_+".dll";
		cmd+=" \""+project.name_+"\" \""+file.replace("/","\\")+"\"";
		.sysCmd(cmd);
	},this);
};

Platform.sysCmd=function(cmd) {
	Console.writeLn(cmd);
	if(Shell.system(cmd)) {
		throw(new BuildError("Platform: Tool reported error."));
	};
};

Platform.setEnvPath=function(solution,project) {
	var newPath;

	newPath=.originalEnvPath;

	ForEach(.getOptionCategory(solution,project,"path"),function(key,value) {
		newPath=key+";"+newPath;
	},this);

	Shell.putenv("PATH="+newPath);
};

Platform.optionGenerate=function(solution,project,mode) {
	switch(mode) {
		case "build":
			.optionGenerateBuild(solution,project);
			break;
		case "clean":
			.optionGenerateClean(solution,project);
			break;
	};
};

Platform.optionGenerateBuild=function(solution,project) {
	if(.getOption(solution,project,"generate","licence-dependency",false)) {
		if(!Shell.fileExists("licence-dependency.txt")) {
			licenceContent="";

			licenceFile=.getOptionCategory(solution,project,"licence-dependency");
			ForEach(licenceFile,function(key,value) {
				file=(.pathDependency()+"/"+key+".licence.txt").replace("/","\\");
				if(Shell.fileExists(file)) {
					licenceContent+=Shell.fileGetContents(file);
					licenceContent+="\n\n";
				};
			},this);
			Shell.filePutContents("licence-dependency.txt",licenceContent);
		};
	};
};

Platform.optionGenerateClean=function(solution,project) {
	if(.getOption(solution,project,"generate","licence-dependency",false)) {
		Shell.removeFile("licence-dependency.txt");
	};
};

Platform.listLicence=function(solution,project) {
	var licenceList;
	var message;
	var typeX;


	typeX=.projectTypeX(project.type_);

	message="";
	licenceList=.getOptionCategory(solution,project,"licence");
	ForEach(licenceList,function(key,value) {
		if(message.length) {
			message+=", ";
		};
		message+=key;
	});

	if(message.length) {
		Console.writeLn(solution.name_+"."+project.name_+"."+typeX+" => "+message);
	} else {
		Console.writeLn(solution.name_+"."+project.name_+"."+typeX+" - unknown");
	};

	licenceList=.getOptionCategory(solution,project,"licence-list");

	ForEach(licenceList,function(key,value) {
		if(Script.isArray(value)) {
			message="";
			ForEach(value,function(keyX,valueX) {
				if(message.length) {
					message+=", ";
				};
				message+=valueX;
			});
			if(message.length) {
				Console.writeLn("+- "+key+" => "+message);
			} else {
				Console.writeLn("+- "+key+"- unknown");
			};
			return;
		};
		if(Script.isNil(value)) {
			Console.writeLn("+- "+key+"- unknown");
			return;
		};
		Console.writeLn("+- "+key+" => "+value);
	});
};

