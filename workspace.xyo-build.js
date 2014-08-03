//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

.solution("xyo-build",function() {

	.option("licence","mit");

	.project("xyo-version","exe",function() {

		.file("source","xyo-version*");

		.option("version","xyo-version", {
			type:"xyo-cpp",
			sourceBegin:"namespace XYO{\r\n\tnamespace Version{\r\n",
			sourceEnd:"\t};\r\n};\r\n",
			lineBegin:"\t\t"
		});

		.option("sign","xyo-security");

		.install("include","xyo-win-version--rc.h");
		.install("include","xyo-win-version--rc.hpp");

		.dependency("libxyo-xy","libxyo-xy","lib");
		.dependency("libxyo-xo","libxyo-xo","lib");
	});

	.project("xyo-build","exe",function() {

		.file("source","xyo-build.cpp");
		.file("source","xyo-build-copyright.*");
		.file("source","xyo-build-licence.*");

		.file("source","xyo-win-version--rc.h");
		.file("source","xyo-win-version--rc.hpp");

		.file("source","xyo-build-version.cpp");
		.file("source","xyo-build-version.hpp");
		.file("source","xyo-build.rc");

		.install("bin","xyo-build/shell.js","xyo-build");
		.install("bin","xyo-build/make.js","xyo-build");
		.install("bin","xyo-build/platform.js","xyo-build");
		.install("bin","xyo-build/project.js","xyo-build");
		.install("bin","xyo-build/solution.js","xyo-build");
		.install("bin","xyo-build/build.js","xyo-build");

		.install("bin","xyo-build/platform.win32-msvc-express-native.js","xyo-build");
		.install("bin","xyo-build/platform.win64-msvc-express-native.js","xyo-build");

		.option("version","xyo-version", {
			type:"xyo-cpp",
			sourceBegin:"namespace XYO{\r\n\tnamespace Build{\r\n",
			sourceEnd:"\t};\r\n};\r\n",
			lineBegin:"\t\t"
		});

		.option("sign","xyo-security");

		.dependency("quantum-script","libquantum-script","lib");
		.dependencyProject("xyo-version","exe");
	});

	if(Platform.is("win")) {
		.project("xyo-coff-to-def","exe",function() {

			.file("source","xyo-coff-to-def.cpp");
			.file("source","xyo-coff-to-def-copyright.*");
			.file("source","xyo-coff-to-def-licence.*");

			.file("source","xyo-coff-to-def-version.cpp");
			.file("source","xyo-coff-to-def-version.hpp");
			.file("source","xyo-coff-to-def.rc");

			.option("version","xyo-version", {
				type:"xyo-cpp",
				sourceBegin:"namespace XYO{\r\n\tnamespace CoffToDef{\r\n",
				sourceEnd:"\t};\r\n};\r\n",
				lineBegin:"\t\t"
			});

			.option("sign","xyo-security");
			.dependency("libxyo-xy","libxyo-xy","lib");
			.dependency("libxyo-xo","libxyo-xo","lib");
			.dependencyProject("xyo-version","exe");
		});
	};

});

