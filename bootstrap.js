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

			.install("bin","xyo-build/shell.js","xyo-build");
			.install("bin","xyo-build/make.js","xyo-build");
			.install("bin","xyo-build/platform.js","xyo-build");
			.install("bin","xyo-build/project.js","xyo-build");
			.install("bin","xyo-build/solution.js","xyo-build");
			.install("bin","xyo-build/build.js","xyo-build");
			.install("bin","xyo-build.config.js");

			.install("bin","xyo-build/platform.win32-msvc-express-native.js","xyo-build");
			.install("bin","xyo-build/platform.win64-msvc-express-native.js","xyo-build");

			.install("bin","xyo-build.exe");
			.install("bin","xyo-version.exe");
			.install("bin","xyo-coff-to-def.exe");

			.install("include","xyo-win-version--rc.h");
			.install("include","xyo-win-version--rc.hpp");

		});

	};

});

