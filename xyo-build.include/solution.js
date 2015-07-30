//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

function Solution() {
	.name_="";
	.project_= {};
	.option_= {};
	.dependencyOption_= {};
	.projectBasePath_=null;
	.projectBasePathStack_=[];
	.projectBasePathStackIndex_=0;
	.projectBasePathStack_[.projectBasePathStackIndex_]=null;
	.solutionPath_=Shell.getcwd();

	.name=function(name) {
		.name_=name;
	};

	.project=function(name,type,proc) {
		var typeX;
		typeX=Platform.projectTypeX(type);
		.project_[name+"."+typeX]=new Project();
		.project_[name+"."+typeX].name(name);
		.project_[name+"."+typeX].type(type);
		.project_[name+"."+typeX].basePath_=.projectBasePath_;

		var restorePath_=null;
		if(.projectBasePath_) {
			restorePath_=Shell.getcwd();
			Shell.chdir(.projectBasePath_);
		};

		proc.apply(.project_[name+"."+typeX]);

		if(restorePath_) {
			Shell.chdir(restorePath_);
		};
	};

	.option=function(category,name,value) {
		if(Script.isNil(.option_[category])) {
			.option_[category]= {};
		};
		.option_[category][name]=value;
	};

	.dependencyOption=function(category,name,value) {
		if(Script.isNil(.dependencyOption_[category])) {
			.dependencyOption_[category]= {};
		};
		.dependencyOption_[category][name]=value;
	};

	.pushProjectPath_=function(path) {
		.projectBasePathStackIndex_++;
		if(Script.isNil(.projectBasePath_)) {
			.projectBasePath_=path;
		} else {
			.projectBasePath_+="/"+path;
		};
		.projectBasePathStack_[.projectBasePathStackIndex_]=.projectBasePath_;
	};

	.popProjectPath_=function() {
		.projectBasePathStackIndex_--;
		.projectBasePath_=.projectBasePathStack_[.projectBasePathStackIndex_];
	};

	.projectFromPath=function(path,name) {
		.pushProjectPath_(path);
		if(Script.isNil(name)) {
			name="project.xyo-build.js";
		};
		Script.include.call(this,path+"/"+name);
		.popProjectPath_();
	};

	.withPath=function(path,proc) {
		.pushProjectPath_(path);
		proc.apply(this);
		.popProjectPath_();
	};

};

