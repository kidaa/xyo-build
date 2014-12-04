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

			.install("bin","xyo-build.library/shell.js","xyo-build.library");
			.install("bin","xyo-build.library/make.js","xyo-build.library");
			.install("bin","xyo-build.library/platform.js","xyo-build.library");
			.install("bin","xyo-build.library/project.js","xyo-build.library");
			.install("bin","xyo-build.library/solution.js","xyo-build.library");
			.install("bin","xyo-build.library/build.js","xyo-build.library");
			.install("bin","xyo-build.config.js");

			.install("bin","xyo-build.library/platform.win32-msvc-express-native.js","xyo-build.library");
			.install("bin","xyo-build.library/platform.win64-msvc-express-native.js","xyo-build.library");

			.install("bin","xyo-build.exe");
			.install("bin","xyo-version.exe");
			.install("bin","xyo-coff-to-def.exe");

			.install("include","xyo-win-version--rc.h");
			.install("include","xyo-win-version--rc.hpp");

		});

	};

	if(Platform.is("unix")) {

		.project("xyo-build","install",function() {

			.install("bin","xyo-build.library/shell.js","xyo-build.library");
			.install("bin","xyo-build.library/make.js","xyo-build.library");
			.install("bin","xyo-build.library/platform.js","xyo-build.library");
			.install("bin","xyo-build.library/project.js","xyo-build.library");
			.install("bin","xyo-build.library/solution.js","xyo-build.library");
			.install("bin","xyo-build.library/build.js","xyo-build.library");
			.install("bin","xyo-build.config.js");

			.install("bin","xyo-build.library/platform.ubuntu-x64-native.js","xyo-build.library");

			.install("bin","xyo-build");
			.install("bin","xyo-version");

		});

	};


});

