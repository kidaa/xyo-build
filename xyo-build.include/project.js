//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

function Project() {
	.name_="";
	.type_="";
	.option_= {};
	.file_= {};
	.dependency_= {};
	.dependencyOption_= {};
	.dependencyProject_= {};
	.mark=false;
	.install_= {};
	.basePath_=null;
	.privateDependency_= {};
	.privateDependencyProject_= {};

	.process=function() {
		return true;
	};
	.fileDependency_= {};

	.name=function(name) {
		.name_=name;
	};

	.type=function(type) {
		.type_=type;
	};

	.option=function(category,name,value) {
		if(Script.isNil(.option_[category])) {
			.option_[category]= {};
		};
		if(Script.isArray(name)) {
			ForEach(name,function(keyX,valueX) {
				.option_[category][valueX]=value;
			},this);
		} else {
			.option_[category][name]=value;
		};
	};

	.file=function(category,name,type) {
		if(Script.isUndefined(type)) {
			type=null;
		};
		if(Script.isNil(.file_[category])) {
			.file_[category]= {};
		};
		if(Script.isArray(name)||Script.isObject(name)) {
			ForEach(name,function(key,value) {
				.file_[category][value]=type;
			},this);
		};
		.file_[category][name]=type;
	};

	.install=function(category,name,path) {
		if(Script.isNil(.install_[category])) {
			.install_[category]= {};
		};
		if(Script.isArray(name)||Script.isObject(name)) {
			ForEach(name,function(key,value) {
				.install_[category][value]=path;
			},this);
		};
		.install_[category][name]=path;
	};

	.dependency=function(solution,project,type) {
		if(Script.isNil(.dependency_[solution])) {
			.dependency_[solution]= {};
		};
		if(Script.isNil(.dependency_[solution][project])) {
			.dependency_[solution][project]= {};
		};
		.dependency_[solution][project][type]=true;
	};

	.dependencyOption=function(category,name,value) {
		if(Script.isNil(.dependencyOption_[category])) {
			.dependencyOption_[category]= {};
		};
		.dependencyOption_[category][name]=value;
	};

	.dependencyProject=function(project,type) {
		if(Script.isNil(.dependencyProject_[project])) {
			.dependencyProject_[project]= {};
		};
		.dependencyProject_[project][type]=true;
	};

	.privateDependencyProject=function(project,type) {
		if(Script.isNil(.privateDependencyProject_[project])) {
			.privateDependencyProject_[project]= {};
		};
		.privateDependencyProject_[project][type]=true;
	};

	.privateDependency=function(solution,project,type) {
		if(Script.isNil(.privateDependency_[solution])) {
			.privateDependency_[solution]= {};
		};
		if(Script.isNil(.privateDependency_[solution][project])) {
			.privateDependency_[solution][project]= {};
		};
		.privateDependency_[solution][project][type]=true;
	};

};

