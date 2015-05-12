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

		.install("bin","xyo-build.include/shell.js","xyo-build.include");
		.install("bin","xyo-build.include/make.js","xyo-build.include");
		.install("bin","xyo-build.include/platform.js","xyo-build.include");
		.install("bin","xyo-build.include/project.js","xyo-build.include");
		.install("bin","xyo-build.include/solution.js","xyo-build.include");
		.install("bin","xyo-build.include/build.js","xyo-build.include");

		.install("bin","xyo-build.include/platform.win32-msvc.js","xyo-build.include");
		.install("bin","xyo-build.include/platform.win64-msvc.js","xyo-build.include");

		.option("version","xyo-version", {
			type:"xyo-cpp",
			sourceBegin:"namespace XYO{\r\n\tnamespace Build{\r\n",
			sourceEnd:"\t};\r\n};\r\n",
			lineBegin:"\t\t"
		});

		.option("sign","xyo-security");

		.dependency("libquantum-script","libquantum-script","lib");
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


