//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

.solution("xyo-build",function() {

	if(Platform.is("win")) {

		.project("xyo-build","install",function() {

			.install("bin","xyo-build.include/shell.js","xyo-build.include");
			.install("bin","xyo-build.include/make.js","xyo-build.include");
			.install("bin","xyo-build.include/platform.js","xyo-build.include");
			.install("bin","xyo-build.include/project.js","xyo-build.include");
			.install("bin","xyo-build.include/solution.js","xyo-build.include");
			.install("bin","xyo-build.include/build.js","xyo-build.include");
			.install("bin","xyo-build.config.js");

			.install("bin","xyo-build.include/platform.win32-msvc.js","xyo-build.include");
			.install("bin","xyo-build.include/platform.win64-msvc.js","xyo-build.include");

			.install("bin","xyo-build.exe");
			.install("bin","xyo-version.exe");
			.install("bin","xyo-coff-to-def.exe");

			.install("include","xyo-win-version--rc.h");
			.install("include","xyo-win-version--rc.hpp");

		});

	};

	if(Platform.is("unix")) {

		.project("xyo-build","install",function() {

			.install("bin","xyo-build.include/shell.js","xyo-build.include");
			.install("bin","xyo-build.include/make.js","xyo-build.include");
			.install("bin","xyo-build.include/platform.js","xyo-build.include");
			.install("bin","xyo-build.include/project.js","xyo-build.include");
			.install("bin","xyo-build.include/solution.js","xyo-build.include");
			.install("bin","xyo-build.include/build.js","xyo-build.include");
			.install("bin","xyo-build.config.js");

			.install("bin","xyo-build.include/platform.ubuntu-x64.js","xyo-build.include");

			.install("bin","xyo-build");
			.install("bin","xyo-version");

		});

	};

});

