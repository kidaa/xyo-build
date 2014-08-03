//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

function Make() {
	.targets_= {};
	.threadsCount=Build.threadsCount_;

	.target=function(target,source,proc,this_,arg) {
		if(Script.isArray(target)||Script.isObject(target)) {
			ForEach(target,function(key,value) {
				.targets_[value]=[source,proc,this_,arg,false,false,false];
			},this);
		};
		.targets_[target]=[source,proc,this_,arg,false,false];
	};

	.targetX=function(target,source,proc) {
		if(Script.isArray(target)||Script.isObject(target)) {
			ForEach(target,function(key,value) {
				.targets_[value]=[source,proc,undefined,[target,source],false,false,false];
			},this);
		};
		.targets_[target]=[source,proc,undefined,[target,source],false,false,false];
	};

	.build=function(target) {
		var buildTree=[];
		var m;
		var targetToBuild;
		var count;
		var threads;
		var done;
		var countX;

		if(Script.isNil(target)) {
			ForEach(.targets_,function(key) {
				.build(key);
			},this);
			return;
		};

		ForEach(.targets_,function(key,value) {
			.targets_[key][4]=false;
			.targets_[key][5]=false;
		},this);

		.buildTreeGenerate_(buildTree,target,0);

		for(m=buildTree.length-1; m>=0; --m) {
			if(!buildTree[m]) {
				continue;
			};

			targetToBuild=[];
			ForEach(buildTree[m],function(key) {
				if(!.targets_[key][5]) {
					targetToBuild[targetToBuild.length]=key;
				};
			},this);

			count=0;
			threads=[];
			done=0;

			while(count<targetToBuild.length) {
				CurrentFiber.sleep(1);
				if(threads.length<.threadsCount) {
					if(count<targetToBuild.length) {
						threads[threads.length]=[newThread(.targets_[targetToBuild[count]][1],.targets_[targetToBuild[count]][2],.targets_[targetToBuild[count]][3]),targetToBuild[count]];
						++count;
						continue;
					};
				};
				break;
			};
			while(done<targetToBuild.length) {
				CurrentFiber.sleep(1);
				countX=0;
				for(k=0; k<threads.length; ++k) {
					if(threads[k]) {
						if(threads[k][0].isTerminated()) {
							if(threads[k][0].getReturnedValue()) {
								throw(new BuildError("Make: Platform reported error."));
							};
							if(!Shell.fileExists(threads[k][1])) {
								throw(new BuildError("Make: build failed, target not found: "+threads[k][1]));
							};
							.targets_[threads[k][1]][5]=true;
							threads[k]=null;
							++done;
							continue;
						};
						countX++;
					};
				};
				if(countX>=.threadsCount) {
					continue;
				};
				for(k=0; k<threads.length; ++k) {
					if(!threads[k]) {
						if(count<targetToBuild.length) {
							threads[k]=[newThread(.targets_[targetToBuild[count]][1],.targets_[targetToBuild[count]][2],.targets_[targetToBuild[count]][3]),targetToBuild[count]];
							++count;
							continue;
						};
					};
				};
			};
		};
	};

	.buildTreeGenerate_=function(buildTree,target,level) {
		if(Script.isNil(target)) {
			return true;
		};
		if(Script.isNil(buildTree[level])) {
			buildTree[level]= {};
		};
		if(.buildTreeGenerateTarget_(buildTree,target,level)) {
			buildTree[level][target]=true;
			return true;
		};
		if(!Shell.fileExists(target)) {
			buildTree[level][target]=true;
			return true;
		};
		return false;
	};

	.buildTreeGenerateTarget_=function(buildTree,target,level) {
		if(Script.isNil(.targets_[target])) {
			throw(new BuildError("Make: target not found @ "+target));
		};

		if(.targets_[target][4]) {
			ForEach(.targets_,function(key,value) {
				.targets_[key][6]=false;
			},this);
			.buildTreeBumpTarget_(buildTree,target,level);
			return false;
		};

		.targets_[target][4]=true;

		if(Script.isNil(.targets_[target][0])) {
			buildTree[level][target]=true;
			return true;
		};

		if(Script.isArray(.targets_[target][0])||Script.isObject(.targets_[target][0])) {
			var retV;
			retV=false;

			ForEach(.targets_[target][0],function(key,value) {
				if(.buildTreeGenerateTargetSource_(buildTree,target,value,level)) {
					retV=true;
				};
			},this);
			return retV;
		};

		return .buildTreeGenerateTargetSource_(buildTree,target,.targets_[target][0],level);
	};

	.buildTreeGenerateTargetSource_=function(buildTree,target,source,level) {
		if(Script.isNil(.targets_[target])) {
			throw(new BuildError("Make: target not found @ "+target));
		};

		if(Script.isNil(.targets_[source])) {
			if(!Shell.fileExists(source)) {
				throw(new BuildError("Make: source not found @ "+source));
			};
			if(Shell.compareLastWriteTime(target,source)<0) {
				buildTree[level][target]=true;
				return true;
			};
			return false;
		};
		if(Shell.fileExists(source)) {
			if(Shell.compareLastWriteTime(target,source)<0) {
				buildTree[level][target]=true;
				.buildTreeGenerate_(buildTree,source,level+1);
				return true;
			};
		};
		return .buildTreeGenerate_(buildTree,source,level+1);
	};


	.buildTreeBumpTarget_=function(buildTree,target,level) {
		if(Script.isNil(.targets_[target])) {
			return;
		};

		if(.targets_[target][6]) {
			return;
		};

		.targets_[target][6]=true;

		if(Script.isArray(.targets_[target][0])||Script.isObject(.targets_[target][0])) {
			ForEach(.targets_[target][0],function(key,value) {
				.buildTreeBumpSource_(buildTree,target,value,level+1);
			},this);
			return;
		};

		.buildTreeBumpSource_(buildTree,target,.targets_[target][0],level+1);
	};


	.buildTreeBumpSource_=function(buildTree,target,source,level) {
		ForEach(buildTree,function(key,value) {
			ForEach(value,function(keyX,valueX) {
				if(keyX==source) {
					if(Script.isNil(buildTree[level])) {
						buildTree[level]= {};
					};
					buildTree[level][source]=true;
					.buildTreeBumpTarget_(buildTree,source,level);
				};
			},this);
		},this);
	};

	.cmdTouch=function() {
		if(Shell.fileExists(this)) {
			Shell.touch(this);
		};
	};

	.cmdCopyX=function(target,source) {
		Shell.prepareFilePath(target);
		Shell.copy(source,target);
	};


};

