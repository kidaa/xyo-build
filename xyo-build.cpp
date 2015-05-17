//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef XYO_OS_TYPE_WIN
#include <windows.h>
#endif

#ifdef XYO_OS_TYPE_WIN
#ifdef XYO_MEMORY_LEAK_DETECTOR
#include "vld.h"
#endif
#endif

#include "libquantum-script.hpp"

#include "xyo-build-licence.hpp"
#include "xyo-build-copyright.hpp"
#ifndef XYO_BUILD_NO_VERSION
#include "xyo-build-version.hpp"
#endif

//#define QUANTUM_SCRIPT_VM_DEBUG_RUNTIME

using namespace XYO;
using namespace XYO::XY;
using namespace XYO::XO;
using namespace Quantum::Script;

bool isError;

QUANTUM_SCRIPT_INSTRUCTION_DEFINE(Build_isError);

QUANTUM_SCRIPT_INSTRUCTION_IMPLEMENT(Build_isError) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
	printf("#%p    build-is-error\n", context->currentProgramCounter);
#endif

	TPointer<Variable> operand1;
	operand1 = context->getArgument(0);
	if (operand1) {
		isError=operand1->toBoolean();
	};
	return;
};


class Application :
	public virtual IMain {
		XYO_XY_DEFINE_PRIVATE_COPY(Application);
	protected:

		static void initExecutive(Executive *);

		void showUsage();
		void showLicence();

	public:

		inline Application() {
		};

		int main(int cmdN, char *cmdS[]);

};

void Application::initExecutive(Executive *executive) {
	//executive->configPrintStackTraceLimit=1;
	executive->compileStringX(
		"\n"
		"function With(this_,proc_){\n"
		"\tproc_.call(this_);\n"
		"};\n"
		"function ForEach(what_,proc_,this_){\n"
		"\tfor(var key in what_){\n"
		"\t\tproc_.call(this_,key,what_[key]);\n"
		"\t};\n"
		"};\n"
		"Script.include(\"xyo-build.include/shell.js\");\n"
		"var Build={};\n"
	);

	executive->setVmFunction("Build.isError(flag)", InstructionBuild_isError, NULL);
};

void Application::showUsage() {
#ifdef XYO_BUILD_NO_VERSION
	printf("XYO Build\n");
#else
	printf("XYO Build - version %s build %s [%s]\n", XYO::Build::Version::getVersion(), XYO::Build::Version::getBuild(), XYO::Build::Version::getDatetime());
#endif
	printf("%s\n\n", XYO::Build::Copyright::fullCopyright());

	printf("%s\n",
	       "options:\n"
	       "    --licence           show licence\n"
	       "    --help              this help\n"
	       "    --script script.js  execute script file [default is workspace.xyo-build.js]\n"
	      );
};

void Application::showLicence() {
	printf("%s", XYO::Build::Licence::content());
};

int Application::main(int cmdN, char *cmdS[]) {
	int i;
	char *opt;
	const char *script_;

	for (i = 1; i < cmdN; ++i) {
		if (strncmp(cmdS[i], "--", 2) == 0) {
			opt = &cmdS[i][2];
			if (strcmp(opt, "help") == 0) {
				showUsage();
				return 0;
			};
			if (strcmp(opt, "licence") == 0) {
				showLicence();
				if (cmdN == 2) {
					return 0;
				};
			};
			continue;
		};
	};

	script_ = "workspace.xyo-build.js";

	for (i = 1; i < cmdN; ++i) {
		if (i == 1) {
			if (strlen(cmdS[i]) >= 3) {
				if (strcmp(&cmdS[i][strlen(cmdS[i]) - 3], ".js") == 0) {
					if (strncmp(cmdS[i], "--", 2) != 0) {
						script_ = cmdS[i];
						continue;
					};
				};
			};
		};
		if (strcmp(cmdS[i], "--script") == 0) {
			++i;
			if (i < cmdN) {
				script_ = cmdS[i];
			};
			continue;
		};
	};

	String scriptConfig=(ExecutiveX::getExecutive()).pathExecutable;
	scriptConfig<<"/xyo-build.config.js";
	scriptConfig=StringX::replace(scriptConfig,"\\","/");



	String script;
	script << "\n"
	       "function BuildError(message){\n"
	       "\tthis.message=message;\n"
	       "\tthis.name=\"Build\";\n"
	       "};\n"
	       "BuildError.prototype=new Error();\n"
	       "function ___main(){\n"
	       "\tScript.include(\"xyo-build.include/shell.js\");\n"
	       "\tScript.include(\"xyo-build.include/build.js\");\n"
	       "\tif(Shell.fileExists(\""<<scriptConfig<<"\")){\n"
	       "\t\tScript.include(\""<<scriptConfig<<"\");\n"
	       "\t};\n"
	       "\tScript.include(\"xyo-build.include/project.js\");\n"
	       "\tScript.include(\"xyo-build.include/solution.js\");\n"
	       "\tScript.include(\"xyo-build.include/platform.js\");\n"
	       "\tBuild.parseCommandLine();\n"
	       "\tif(Build.cmdMode()){\n"
	       "\t}else{\n"
	       "\t\tBuild.includeScript(\"" << script_ << "\");\n"
	       "\t\tPlatform.build(Build.mode_);\n"
	       "\t};\n"
	       "};\n"
	       "function ___exec(){\n"
	       "\ttry{\n"
	       "\t\t___main();\n"
	       "\t}catch(e){\n"
	       "\t\tBuild.isError(true);\n"
	       "\t\tConsole.writeLn(e.toString());\n"
	       "\t\tif(e instanceof BuildError|| e instanceof MakeError){}else{\n"
	       "\t\t\tConsole.write(e.stackTrace);\n"
	       "\t\t};\n"
	       "\t};\n"
	       "};\n"
	       "___exec();\n";


	isError=false;
	if(ExecutiveX::initExecutive(cmdN,cmdS,initExecutive)) {
		if(ExecutiveX::executeString(script)) {
			ExecutiveX::executeEnd();
			if(isError) {
				return -1;
			};
			return 0;
		};
	};

	fflush(stdout);
	printf("%s\n",(ExecutiveX::getError()).value());
	printf("%s",(ExecutiveX::getStackTrace()).value());
	fflush(stdout);
	ExecutiveX::executeEnd();
	return -1;
};

XYO_XY_MAIN_STD(Application);


#ifdef QUANTUM_SCRIPT_AMALGAM
#include "quantum-script-amalgam.cpp"
#endif

