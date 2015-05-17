//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var Platform= {};

Platform.build=function(mode) {
	for(var solution in Build.solution_) {
		.buildSolution(Build.solution_[solution],mode);
	};
};

Platform.buildSolution=function(solution,mode) {
	for(var project in solution.project_) {
		.buildProject_(solution,solution.project_[project],mode);
	};
};

Platform.buildProject_=function(solution,project,mode) {
	for(var project_ in solution.project_) {
		solution.project_[project_].mark=false;
	};
	.buildProject_2(solution,project,mode);
};

Platform.buildProject_2=function(solution,project,mode) {
	if(project.mark) {
		throw(new BuildError("Platform: circular reference found @ "+project.name_+"."+project.type_));
	};
	project.mark=true;
	switch(mode) {
		case "build":
		case "install":
		case "unify":
		case "licence":

			var dependencyLoad_;
			dependencyCheck=true;
			while(dependencyCheck) {
				dependencyCheck=false;

				ForEach(project.dependencyProject_,function(key, value) {
					ForEach(value,function(keyX,valueX) {
						if(valueX) {
							if(Script.isNil(solution.project_[key+"."+keyX])) {
								throw(new BuildError("Platform: local project not found @ "+key+"."+keyX));
							};
							if(!solution.project_[key+"."+keyX].mark) {
								.buildProject_2(solution,solution.project_[key+"."+keyX],mode);
							};
							.loadProjectLocalDependency(solution,project,key,keyX);
							project.dependencyProject_[key][keyX]=false;
							dependencyCheck=true;
						};
					},this);
				},this);

				ForEach(project.privateDependencyProject_,function(key, value) {
					ForEach(value,function(keyX,valueX) {
						if(valueX) {
							if(Script.isNil(solution.project_[key+"."+keyX])) {
								throw(new BuildError("Platform: local project not found @ "+key+"."+keyX));
							};
							if(!solution.project_[key+"."+keyX].mark) {
								.buildProject_2(solution,solution.project_[key+"."+keyX],mode);
							};
							.loadProjectLocalDependency(solution,project,key,keyX);
							project.privateDependencyProject_[key][keyX]=false;
							dependencyCheck=true;
						};
					},this);
				},this);

				ForEach(project.dependency_,function(key, value) {
					ForEach(value,function(keyX,valueX) {
						ForEach(valueX,function(keyT,valueT) {
							if(valueT) {
								.loadProjectDependency(solution,project,key,keyX,keyT);
								project.dependency_[key][keyX][keyT]=false;
								dependencyCheck=true;
							};
						},this);
					},this);
				},this);

				ForEach(project.privateDependency_,function(key, value) {
					ForEach(value,function(keyX,valueX) {
						ForEach(valueX,function(keyT,valueT) {
							if(valueT) {
								.loadProjectDependency(solution,project,key,keyX,keyT);
								project.privateDependency_[key][keyX][keyT]=false;
								dependencyCheck=true;
							};
						},this);
					},this);
				},this);


			};
			break;
	};
	.buildProject_3(solution,project,mode);
};

Platform.buildProject_3=function(solution,project,mode) {
	var restorePath_=null;
	if(project.basePath_) {
		restorePath_=Shell.getcwd();
		Shell.chdir(project.basePath_);
	};

	.buildProject(solution,project,mode);

	if(restorePath_) {
		Shell.chdir(restorePath_);
	};
};

Platform.buildProject=function(solution,project,mode) {
};

Platform.loadProjectLocalDependency=function(solution,project,projectName,projectType) {
};

Platform.loadProjectDependency=function(solution,project,solutionName,projectName,projectType) {
};

Platform.getOption=function(solution,project,category,name,defaultValue) {
	if(!Script.isNil(project.option_[category])) {
		if(!Script.isNil(project.option_[category][name])) {
			return project.option_[category][name];
		};
	};
	if(!Script.isNil(solution.option_[category])) {
		if(!Script.isNil(solution.option_[category][name])) {
			return solution.option_[category][name];
		};
	};
	return defaultValue;
};

Platform.getFileCategory=function(solution,project,category,type) {
	var list_= {};
	var list=[];

	if(Script.isNil(project.file_[category])) {
		return list;
	};
	ForEach(project.file_[category],function(key,value) {
		if(Script.isNil(value)) {
			ForEach(Shell.getFileList(key),function(keyX,valueX) {
				if(Shell.getFileExtension(valueX)==type) {
					list_[valueX]=valueX;
				};
			});
			return;
		};
		if(value==type) {
			ForEach(Shell.getFileList(key),function(keyX,valueX) {
				list_[valueX]=valueX;
			});
		};
	});

	ForEach(list_,function(key) {
		list[list.length]=list_[key];
	});
	return list;
};

Platform.getInstallCategory=function(solution,project,category) {
	if(Script.isNil(project.install_[category])) {
		return {};
	};
	return project.install_[category];
};

Platform.getInstallCategoryX=function(solution,project,category) {
	var list_= {};
	if(Script.isNil(project.install_[category])) {
		return list_;
	};

	ForEach(project.install_[category],function(key,value) {
		list_[key]=value;
	});

	return list_;
};


Platform.getOptionCategory=function(solution,project,category) {
	var list= {};

	if(!Script.isNil(solution.option_[category])) {
		ForEach(solution.option_[category],function(key,value) {
			list[key]=value;
		});
	};

	if(!Script.isNil(project.option_[category])) {
		ForEach(project.option_[category],function(key,value) {
			list[key]=value;
		});
	};
	return list;
};

Platform.uniqueFileName=function(solution,project,file,extension) {
	return project.name_+"."+project.type_+"."+MD5.hash(file)+"."+Shell.getFileName(file)+"."+extension;
};


Platform.includePlatform=function(platformName) {
	var xyoPlatform_;
	if(Script.isNil(platformName)) {
		xyoPlatform_=Shell.getenv("XYO_BUILD_PLATFORM");
	} else {
		xyoPlatform_=platformName;
	};
	if(xyoPlatform_.length==0) {
		throw(new BuildError("Platform: environment XYO_BUILD_PLATFORM not defined, "));
	};
	var xyoPlatform1_=Shell.getFileName(xyoPlatform_);
	if(xyoPlatform1_.lastIndexOf(".js")<0) {
		xyoPlatform1_+=".js";
	};
	if(xyoPlatform1_.indexOf("platform.")<0) {
		xyoPlatform1_="xyo-build.include/platform."+xyoPlatform1_;
	};
	var xyoPlatform2_=Shell.getFilePath(xyoPlatform_);
	if(xyoPlatform2_) {
		xyoPlatform_=xyoPlatform2_+"/"+xyoPlatform1_;
	} else {
		xyoPlatform_=xyoPlatform1_;
	};

	Script.include(xyoPlatform_);
};

Platform.touchIfExists=function(file) {
	Shell.touchIfExists(file);
};

// Include platform
Platform.includePlatform(Build.platform_);
