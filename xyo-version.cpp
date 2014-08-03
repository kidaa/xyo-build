//
// XYO Version
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#ifdef XYO_OS_TYPE_WIN
#ifdef XYO_MEMORY_LEAK_DETECTOR
#include "vld.h"
#endif
#endif

#include "libxyo-xy.hpp"
#include "libxyo-xo.hpp"

#ifndef XYO_VERSION_INTERNAL
#include "xyo-version-version.hpp"
#endif
#include "xyo-version-licence.hpp"
#include "xyo-version-copyright.hpp"

using namespace XYO;
using namespace XYO::XY;
using namespace XYO::XO;

class Application :
	public virtual IMain {
		XYO_XY_DEFINE_PRIVATE_COPY(Application);
	protected:

		String applicationName;
		String varFileName;
		String fileIn;
		String fileOut;
		String sourceBegin;
		String sourceEnd;
		String lineBegin;
		String codeExport;

		unsigned int versionA, versionB, versionC, versionD;
		int versionYear;
		int versionMon;
		int versionMDay;
		int versionHour;
		int versionMin;
		int versionSec;


		String strStrip(String str);
		bool loadVarFile(char *inFile, TRedBlackTree<String, String > &myVar);
		bool saveVarFile(char *outFile, TRedBlackTree<String, String > &myVar);
		void setTime();
		void initVersion();
		void setVar(TRedBlackTree<String, String > &myVar);
		void getVar(TRedBlackTree<String, String > &myVar);
		void writeToFileH(char *fileName);
		void writeToFileHpp(char *fileName);
		void writeToFileXyoCpp(char *fileName);
		void writeToFileXyoC(char *fileName);
		void writeToFileJs(char *fileName);
		void writeToFilePhp(char *fileName);
		bool processFile(char *in, char *out, char **inS, char **outS);
		bool doParseFile(char *in, char *out);

		void showUsage();
		void showLicence();


	public:

		inline Application() {};

		int main(int cmdN, char *cmdS[]);

		static void memoryInit();

};




String Application::strStrip(String str) {
	return StringX::trimWithElement(str, "\r\n\t ");
};

bool Application::loadVarFile(char *inFile, TRedBlackTree<String, String > &myVar) {
	FILE *in;
	char buffer[1024];
	String var;
	String key;
	String value;
	size_t index;
	in = fopen(inFile, "rt");
	if (in != NULL) {
		while (fgets(buffer, 1024, in)) {
			var = strStrip(buffer);
			if (var.length()) {
				if (StringX::indexOf(var, "#", 0, index)) {
					continue;
				};
				if (StringX::indexOf(var, "=", 0, index)) {
					key = StringX::substring(var, 0, index);
					value = StringX::substring(var, index + 1);
					myVar.set(key, value);
				};
			};
		};
		fclose(in);
		return true;
	};
	return false;
};

bool Application::saveVarFile(char *outFile, TRedBlackTree<String, String > &myVar) {
	FILE *out;
	out = fopen(outFile, "wt");
	if (out != NULL) {
		TXRedBlackTreeNode<String, String > *scan;
		for (scan = myVar.begin(); scan; scan = scan->succesor()) {
			fprintf(out, "%s=%s\r\n", scan->key.value(), scan->value.value());
		};
		fclose(out);
		return true;
	};
	return false;
};

void Application::setTime() {
	time_t time_;
	struct tm *timeinfo_;
	time(&time_);
	timeinfo_ = localtime(&time_);

	versionYear = timeinfo_->tm_year + 1900;
	versionMon = timeinfo_->tm_mon + 1;
	versionMDay = timeinfo_->tm_mday;
	versionHour = timeinfo_->tm_hour;
	versionMin = timeinfo_->tm_min;
	versionSec = timeinfo_->tm_sec;
};

void Application::initVersion() {
	setTime();
	versionA = 0;
	versionB = 0;
	versionC = 1;
	versionD = 0;
};

void Application::setVar(TRedBlackTree<String, String > &myVar) {
	char buffer[1024];

	sprintf(buffer, "%d.%d.%d", versionA, versionB, versionC);
	myVar.set("version", buffer);
	sprintf(buffer, "%d", versionD);
	myVar.set("build", buffer);
	sprintf(buffer, "%04d-%02d-%02d", versionYear, versionMon, versionMDay);
	myVar.set("date", buffer);
	sprintf(buffer, "%02d:%02d:%02d", versionHour, versionMin, versionSec);
	myVar.set("time", buffer);
};

void Application::getVar(TRedBlackTree<String, String > &myVar) {
	String value;
	if (myVar.get("version", value)) {
		sscanf(value.value(), "%d.%d.%d", &versionA, &versionB, &versionC);
	};
	if (myVar.get("build", value)) {
		sscanf(value.value(), "%d", &versionD);
	};
	if (myVar.get("date", value)) {
		sscanf(value.value(), "%04d-%02d-%02d", &versionYear, &versionMon, &versionMDay);
	};
	if (myVar.get("time", value)) {
		sscanf(value.value(), "%02d:%02d:%02d", &versionHour, &versionMin, &versionSec);
	};
};

void Application::writeToFileH(char *fileName) {
	FILE *out;
	String appName;

	appName = StringX::toUpperCaseAscii(applicationName);
	appName = StringX::replace(appName, "-", "_");

	out = fopen(fileName, "wb");
	if (out != NULL) {
		fprintf(out, "#ifndef %s_VERSION_H\r\n", appName.value());
		fprintf(out, "#define %s_VERSION_H\r\n", appName.value());
		fprintf(out, "#define %s_VERSION_ABCD      %d,%d,%d,%d\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "#define %s_VERSION_A         %d\r\n", appName.value(), versionA);
		fprintf(out, "#define %s_VERSION_B         %d\r\n", appName.value(), versionB);
		fprintf(out, "#define %s_VERSION_C         %d\r\n", appName.value(), versionC);
		fprintf(out, "#define %s_VERSION_D         %d\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_STR_ABCD  \"%d.%d.%d.%d\"\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "#define %s_VERSION_STR       \"%d.%d.%d\"\r\n", appName.value(), versionA, versionB, versionC);
		fprintf(out, "#define %s_VERSION_STR_BUILD \"%d\"\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_BUILD     %d\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_HOUR      %d\r\n", appName.value(), versionHour);
		fprintf(out, "#define %s_VERSION_MINUTE    %d\r\n", appName.value(), versionMin);
		fprintf(out, "#define %s_VERSION_SECOND    %d\r\n", appName.value(), versionSec);
		fprintf(out, "#define %s_VERSION_DAY       %d\r\n", appName.value(), versionMDay);
		fprintf(out, "#define %s_VERSION_MONTH     %d\r\n", appName.value(), versionMon);
		fprintf(out, "#define %s_VERSION_YEAR      %d\r\n", appName.value(), versionYear);
		fprintf(out, "#define %s_VERSION_STR_DATETIME \"%04d-%02d-%02d %02d:%02d:%02d\"\r\n", appName.value(),
			versionYear, versionMon, versionMDay, versionHour, versionMin, versionSec);
		fprintf(out, "#endif\r\n");
		fprintf(out, "\r\n");
		fclose(out);
	};
};

void Application::writeToFileHpp(char *fileName) {
	FILE *out;
	String appName;

	appName = StringX::toUpperCaseAscii(applicationName);
	appName = StringX::replace(appName, "-", "_");

	out = fopen(fileName, "wb");
	if (out != NULL) {
		fprintf(out, "#ifndef %s_VERSION_HPP\r\n", appName.value());
		fprintf(out, "#define %s_VERSION_HPP\r\n", appName.value());
		fprintf(out, "#define %s_VERSION_ABCD      %d,%d,%d,%d\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "#define %s_VERSION_A         %d\r\n", appName.value(), versionA);
		fprintf(out, "#define %s_VERSION_B         %d\r\n", appName.value(), versionB);
		fprintf(out, "#define %s_VERSION_C         %d\r\n", appName.value(), versionC);
		fprintf(out, "#define %s_VERSION_D         %d\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_STR_ABCD  \"%d.%d.%d.%d\"\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "#define %s_VERSION_STR       \"%d.%d.%d\"\r\n", appName.value(), versionA, versionB, versionC);
		fprintf(out, "#define %s_VERSION_STR_BUILD \"%d\"\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_BUILD     %d\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_HOUR      %d\r\n", appName.value(), versionHour);
		fprintf(out, "#define %s_VERSION_MINUTE    %d\r\n", appName.value(), versionMin);
		fprintf(out, "#define %s_VERSION_SECOND    %d\r\n", appName.value(), versionSec);
		fprintf(out, "#define %s_VERSION_DAY       %d\r\n", appName.value(), versionMDay);
		fprintf(out, "#define %s_VERSION_MONTH     %d\r\n", appName.value(), versionMon);
		fprintf(out, "#define %s_VERSION_YEAR      %d\r\n", appName.value(), versionYear);
		fprintf(out, "#define %s_VERSION_STR_DATETIME \"%04d-%02d-%02d %02d:%02d:%02d\"\r\n", appName.value(),
			versionYear, versionMon, versionMDay, versionHour, versionMin, versionSec);
		fprintf(out, "#endif\r\n");
		fprintf(out, "\r\n");
		fclose(out);
	};
};

void Application::writeToFileXyoCpp(char *fileName) {
	FILE *out;

	String appName;
	String fileName2;

	appName = StringX::toUpperCaseAscii(applicationName);
	appName = StringX::replace(appName, "-", "_");

	fileName2 = fileName;
	fileName2 += "-version.hpp";

	out = fopen(fileName2, "wb");
	if (out != NULL) {
		fprintf(out, "#ifndef %s_VERSION_HPP\r\n", appName.value());
		fprintf(out, "#define %s_VERSION_HPP\r\n\r\n", appName.value());
		fprintf(out, "#define %s_VERSION_ABCD      %d,%d,%d,%d\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "#define %s_VERSION_A         %d\r\n", appName.value(), versionA);
		fprintf(out, "#define %s_VERSION_B         %d\r\n", appName.value(), versionB);
		fprintf(out, "#define %s_VERSION_C         %d\r\n", appName.value(), versionC);
		fprintf(out, "#define %s_VERSION_D         %d\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_STR_ABCD  \"%d.%d.%d.%d\"\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "#define %s_VERSION_STR       \"%d.%d.%d\"\r\n", appName.value(), versionA, versionB, versionC);
		fprintf(out, "#define %s_VERSION_STR_BUILD \"%d\"\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_BUILD     %d\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_HOUR      %d\r\n", appName.value(), versionHour);
		fprintf(out, "#define %s_VERSION_MINUTE    %d\r\n", appName.value(), versionMin);
		fprintf(out, "#define %s_VERSION_SECOND    %d\r\n", appName.value(), versionSec);
		fprintf(out, "#define %s_VERSION_DAY       %d\r\n", appName.value(), versionMDay);
		fprintf(out, "#define %s_VERSION_MONTH     %d\r\n", appName.value(), versionMon);
		fprintf(out, "#define %s_VERSION_YEAR      %d\r\n", appName.value(), versionYear);
		fprintf(out, "#define %s_VERSION_STR_DATETIME \"%04d-%02d-%02d %02d:%02d:%02d\"\r\n\r\n", appName.value(),
			versionYear, versionMon, versionMDay, versionHour, versionMin, versionSec);

		fprintf(out, "#ifndef XYO_RC\r\n\r\n");
		fprintf(out, "%s\n", sourceBegin.value());

		fprintf(out, "%sclass Version{\r\n",lineBegin.value());
		fprintf(out, "%s\tpublic:\r\n",lineBegin.value());
		fprintf(out, "%s\t\t%sstatic const char *getABCD();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getA();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getB();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getC();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getD();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getVersion();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getBuild();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getHour();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getMinute();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getSecond();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getDay();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getMonth();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getYear();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s\t\t%sstatic const char *getDatetime();\r\n",lineBegin.value(),codeExport.value());
		fprintf(out, "%s};\r\n\r\n",lineBegin.value());
		fprintf(out, "%s\r\n", sourceEnd.value());
		fprintf(out, "#endif\r\n");
		fprintf(out, "#endif\r\n");
		fprintf(out, "\r\n");
		fclose(out);
	};


	fileName2 = fileName;
	fileName2 += "-version.cpp";
	out = fopen(fileName2, "wb");
	if (out != NULL) {
		fprintf(out, "#include \"%s-version.hpp\"\r\n\r\n", fileName);
		fprintf(out, "%s\r\n", sourceBegin.value());
		fprintf(out, "%sstatic const char *version_abcd_=\"%d.%d.%d.%d\";\r\n",lineBegin.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "%sstatic const char *version_a_=\"%d\";\r\n",lineBegin.value(), versionA);
		fprintf(out, "%sstatic const char *version_b_=\"%d\";\r\n",lineBegin.value(), versionB);
		fprintf(out, "%sstatic const char *version_c_=\"%d\";\r\n",lineBegin.value(), versionC);
		fprintf(out, "%sstatic const char *version_d_=\"%d\";\r\n",lineBegin.value(), versionD);
		fprintf(out, "%sstatic const char *version_version_=\"%d.%d.%d\";\r\n",lineBegin.value(), versionA, versionB, versionC);
		fprintf(out, "%sstatic const char *version_build_=\"%d\";\r\n",lineBegin.value(), versionD);
		fprintf(out, "%sstatic const char *version_hour_=\"%d\";\r\n",lineBegin.value(), versionHour);
		fprintf(out, "%sstatic const char *version_minute_=\"%d\";\r\n",lineBegin.value(), versionMin);
		fprintf(out, "%sstatic const char *version_second_=\"%d\";\r\n",lineBegin.value(), versionSec);
		fprintf(out, "%sstatic const char *version_day_=\"%d\";\r\n",lineBegin.value(), versionMDay);
		fprintf(out, "%sstatic const char *version_month_=\"%d\";\r\n",lineBegin.value(), versionMon);
		fprintf(out, "%sstatic const char *version_year_=\"%d\";\r\n",lineBegin.value(), versionYear);
		fprintf(out, "%sstatic const char *version_datetime_=\"%04d-%02d-%02d %02d:%02d:%02d\";\r\n\r\n",lineBegin.value(),
			versionYear, versionMon, versionMDay, versionHour, versionMin, versionSec);

		fprintf(out, "%sconst char *Version::getABCD(){return version_abcd_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getA(){return version_a_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getB(){return version_b_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getC(){return version_c_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getD(){return version_d_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getVersion(){return version_version_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getBuild(){return version_build_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getHour(){return version_hour_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getMinute(){return version_minute_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getSecond(){return version_second_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getDay(){return version_day_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getMonth(){return version_month_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getYear(){return version_year_;};\r\n",lineBegin.value());
		fprintf(out, "%sconst char *Version::getDatetime(){return version_datetime_;};\r\n",lineBegin.value());
		fprintf(out, "\r\n%s\r\n", sourceEnd.value());
		fprintf(out, "\r\n");
		fprintf(out, "\r\n");
		fclose(out);
	};
};

void Application::writeToFileXyoC(char *fileName) {
	FILE *out;


	String appName;
	String appNameLow;
	String fileName2;

	appName = StringX::toUpperCaseAscii(applicationName);
	appName = StringX::replace(appName, "-", "_");

	appNameLow = StringX::toLowerCaseAscii(applicationName);
	appNameLow = StringX::replace(appNameLow, "-", "_");

	fileName2 = fileName;
	fileName2 += "-version.h";

	out = fopen(fileName2, "wb");
	if (out != NULL) {
		fprintf(out, "#ifndef %s_VERSION_H\r\n", appName.value());
		fprintf(out, "#define %s_VERSION_H\r\n\r\n", appName.value());
		fprintf(out, "#define %s_VERSION_ABCD      %d,%d,%d,%d\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "#define %s_VERSION_A         %d\r\n", appName.value(), versionA);
		fprintf(out, "#define %s_VERSION_B         %d\r\n", appName.value(), versionB);
		fprintf(out, "#define %s_VERSION_C         %d\r\n", appName.value(), versionC);
		fprintf(out, "#define %s_VERSION_D         %d\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_STR_ABCD  \"%d.%d.%d.%d\"\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "#define %s_VERSION_STR       \"%d.%d.%d\"\r\n", appName.value(), versionA, versionB, versionC);
		fprintf(out, "#define %s_VERSION_STR_BUILD \"%d\"\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_BUILD     %d\r\n", appName.value(), versionD);
		fprintf(out, "#define %s_VERSION_HOUR      %d\r\n", appName.value(), versionHour);
		fprintf(out, "#define %s_VERSION_MINUTE    %d\r\n", appName.value(), versionMin);
		fprintf(out, "#define %s_VERSION_SECOND    %d\r\n", appName.value(), versionSec);
		fprintf(out, "#define %s_VERSION_DAY       %d\r\n", appName.value(), versionMDay);
		fprintf(out, "#define %s_VERSION_MONTH     %d\r\n", appName.value(), versionMon);
		fprintf(out, "#define %s_VERSION_YEAR      %d\r\n", appName.value(), versionYear);
		fprintf(out, "#define %s_VERSION_STR_DATETIME \"%04d-%02d-%02d %02d:%02d:%02d\"\r\n\r\n", appName.value(),
			versionYear, versionMon, versionMDay, versionHour, versionMin, versionSec);

		fprintf(out, "#ifndef XYO_RC\r\n\r\n");
		fprintf(out, "const char *%s_versionGetABCD();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetA();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetB();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetC();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetD();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetVersion();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetBuild();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetHour();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetMinute();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetSecond();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetDay();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetMonth();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetYear();\r\n", appNameLow.value());
		fprintf(out, "const char *%s_versionGetDatetime();\r\n", appNameLow.value());
		fprintf(out, "#endif\r\n");
		fprintf(out, "#endif\r\n");
		fprintf(out, "\r\n");
		fclose(out);
	};


	fileName2 = fileName;
	fileName2 += "-version.c";
	out = fopen(fileName2, "wb");
	if (out != NULL) {
		fprintf(out, "#include \"%s-version.h\"\r\n\r\n", fileName);
		fprintf(out, "static const char *%s_version_version_abcd_=\"%d.%d.%d.%d\";\r\n", appNameLow.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "static const char *%s_version_version_a_=\"%d\";\r\n", appNameLow.value(), versionA);
		fprintf(out, "static const char *%s_version_version_b_=\"%d\";\r\n", appNameLow.value(), versionB);
		fprintf(out, "static const char *%s_version_version_c_=\"%d\";\r\n", appNameLow.value(), versionC);
		fprintf(out, "static const char *%s_version_version_d_=\"%d\";\r\n", appNameLow.value(), versionD);
		fprintf(out, "static const char *%s_version_version_version_=\"%d.%d.%d\";\r\n", appNameLow.value(), versionA, versionB, versionC);
		fprintf(out, "static const char *%s_version_version_build_=\"%d\";\r\n", appNameLow.value(), versionD);
		fprintf(out, "static const char *%s_version_version_hour_=\"%d\";\r\n", appNameLow.value(), versionHour);
		fprintf(out, "static const char *%s_version_version_minute_=\"%d\";\r\n", appNameLow.value(), versionMin);
		fprintf(out, "static const char *%s_version_version_second_=\"%d\";\r\n", appNameLow.value(), versionSec);
		fprintf(out, "static const char *%s_version_version_day_=\"%d\";\r\n", appNameLow.value(), versionMDay);
		fprintf(out, "static const char *%s_version_version_month_=\"%d\";\r\n", appNameLow.value(), versionMon);
		fprintf(out, "static const char *%s_version_version_year_=\"%d\";\r\n", appNameLow.value(), versionYear);
		fprintf(out, "static const char *%s_version_version_datetime_=\"%04d-%02d-%02d %02d:%02d:%02d\";\r\n\r\n", appNameLow.value(),
			versionYear, versionMon, versionMDay, versionHour, versionMin, versionSec);

		fprintf(out, "const char *%s_versionGetABCD(){return %s_version_version_abcd_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetA(){return %s_version_version_a_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetB(){return %s_version_version_b_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetC(){return %s_version_version_c_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetD(){return %s_version_version_d_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetVersion(){return %s_version_version_version_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetBuild(){return %s_version_version_build_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetHour(){return %s_version_version_hour_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetMinute(){return %s_version_version_minute_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetSecond(){return %s_version_version_second_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetDay(){return %s_version_version_day_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetMonth(){return %s_version_version_month_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetYear(){return %s_version_version_year_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "const char *%s_versionGetDatetime(){return %s_version_version_datetime_;};\r\n", appNameLow.value(), appNameLow.value());
		fprintf(out, "\r\n");
		fprintf(out, "\r\n");
		fclose(out);
	};
};

void Application::writeToFileJs(char *fileName) {
	FILE *out;

	String appName;

	appName = StringX::toUpperCaseAscii(applicationName);
	appName = StringX::replace(appName, "-", "_");

	out = fopen(fileName, "wb");
	if (out != NULL) {
		fprintf(out, "var %s_VersionA=%d;\r\n", appName.value(), versionA);
		fprintf(out, "var %s_VersionB=%d;\r\n", appName.value(), versionB);
		fprintf(out, "var %s_VersionC=%d;\r\n", appName.value(), versionC);
		fprintf(out, "var %s_VersionD=%d;\r\n", appName.value(), versionD);
		fprintf(out, "var %s_VersionStrABCD=\"%d.%d.%d.%d\";\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "var %s_VersionStr=\"%d.%d.%d\";\r\n", appName.value(), versionA, versionB, versionC);
		fprintf(out, "var %s_VersionStrBuild=\"%d\";\r\n", appName.value(), versionD);
		fprintf(out, "var %s_VersionBuild=%d;\r\n", appName.value(), versionD);
		fprintf(out, "var %s_VersionHour=%d;\r\n", appName.value(), versionHour);
		fprintf(out, "var %s_VersionMinute=%d;\r\n", appName.value(), versionMin);
		fprintf(out, "var %s_VersionSecond=%d;\r\n", appName.value(), versionSec);
		fprintf(out, "var %s_VersionDay=%d;\r\n", appName.value(), versionMDay);
		fprintf(out, "var %s_VersionMonth=%d;\r\n", appName.value(), versionMon);
		fprintf(out, "var %s_VersionYear=%d;\r\n", appName.value(), versionYear);
		fprintf(out, "var %s_VersionStrDatetime=\"%04d-%02d-%02d %02d:%02d:%02d\";\r\n", appName.value(),
			versionYear, versionMon, versionMDay, versionHour, versionMin, versionSec);
		fprintf(out, "\r\n");
		fclose(out);
	};
};

void Application::writeToFilePhp(char *fileName) {
	FILE *out;

	String appName;

	appName = StringX::toUpperCaseAscii(applicationName);
	appName = StringX::replace(appName, "-", "_");

	out = fopen(fileName, "wb");
	if (out != NULL) {
		fprintf(out, "<?php\n");
		fprintf(out, "$%s_VersionA=%d;\r\n", appName.value(), versionA);
		fprintf(out, "$%s_VersionB=%d;\r\n", appName.value(), versionB);
		fprintf(out, "$%s_VersionC=%d;\r\n", appName.value(), versionC);
		fprintf(out, "$%s_VersionD=%d;\r\n", appName.value(), versionD);
		fprintf(out, "$%s_VersionStrABCD=\"%d.%d.%d.%d\";\r\n", appName.value(), versionA, versionB, versionC, versionD);
		fprintf(out, "$%s_VersionStr=\"%d.%d.%d\";\r\n", appName.value(), versionA, versionB, versionC);
		fprintf(out, "$%s_VersionStrBuild=\"%d\";\r\n", appName.value(), versionD);
		fprintf(out, "$%s_VersionBuild=%d;\r\n", appName.value(), versionD);
		fprintf(out, "$%s_VersionHour=%d;\r\n", appName.value(), versionHour);
		fprintf(out, "$%s_VersionMinute=%d;\r\n", appName.value(), versionMin);
		fprintf(out, "$%s_VersionSecond=%d;\r\n", appName.value(), versionSec);
		fprintf(out, "$%s_VersionDay=%d;\r\n", appName.value(), versionMDay);
		fprintf(out, "$%s_VersionMonth=%d;\r\n", appName.value(), versionMon);
		fprintf(out, "$%s_VersionYear=%d;\r\n", appName.value(), versionYear);
		fprintf(out, "$%s_VersionStrDatetime=\"%04d-%02d-%02d %02d:%02d:%02d\";\r\n", appName.value(),
			versionYear, versionMon, versionMDay, versionHour, versionMin, versionSec);
		fclose(out);
	};
};

bool Application::processFile(char *in, char *out, char **inS, char **outS) {
	FILE *fIn;
	FILE *fOut;
	bool ok;
	char buffer_in[16384];
	char buffer_out[16384];
	int idx_in;
	int k, m, lnIn;
	char *buffer_out_ptr;
	char *buffer_in_ptr;

	ok = false;
	fIn = fopen(in, "rb");
	if (fIn) {
		fOut = fopen(out, "wb");
		if (fOut) {

			while (fgets(buffer_in, 16384, fIn)) {
				strcpy(buffer_out, buffer_in);
				for (k = 0; inS[k]; ++k) {
					strcpy(buffer_in, buffer_out);

					buffer_in_ptr = &buffer_in[0];
					buffer_out[0] = 0;
					buffer_out_ptr = &buffer_out[0];

					lnIn = strlen(inS[k]);

					for (; *buffer_in_ptr;) {

						if (strncmp(buffer_in_ptr, inS[k], lnIn) == 0) {
							buffer_out_ptr = strcat(buffer_out_ptr, outS[k]);
							buffer_in_ptr += lnIn;
						} else {
							buffer_out_ptr = strncat(buffer_out_ptr, buffer_in_ptr, 1);
							buffer_in_ptr += 1;
						};

					};
				};
				fputs(buffer_out, fOut);
			};

			fclose(fOut);
			ok = true;
		};
		fclose(fIn);
	};

	return ok;
};

bool Application::doParseFile(char *in, char *out) {
	char buf1[16];
	char buf2[16];
	char buf3[16];
	char buf4[16];
	char buf5[16];
	char buf6[16];
	char buf7[16];
	char buf8[16];
	char buf9[16];
	char buf10[16];

	char *sIn[] = {
		"@@_VERSION_A_@@", // 1
		"@@_VERSION_B_@@", // 2
		"@@_VERSION_C_@@", // 3
		"@@_VERSION_BUILD_@@", // 4
		"@@_VERSION_HOUR_@@", // 5
		"@@_VERSION_MIN_@@", // 6
		"@@_VERSION_SEC_@@", // 7
		"@@_VERSION_DAY_@@", // 8
		"@@_VERSION_MONTH_@@", // 9
		"@@_VERSION_YEAR_@@", // 10
		NULL
	};

	char *sOut[] = {
		buf1,
		buf2,
		buf3,
		buf4,
		buf5,
		buf6,
		buf7,
		buf8,
		buf9,
		buf10,
		NULL
	};

	sprintf(buf1, "%d", versionA);
	sprintf(buf2, "%d", versionB);
	sprintf(buf3, "%d", versionC);
	sprintf(buf4, "%d", versionD);
	sprintf(buf5, "%d", versionHour);
	sprintf(buf6, "%d", versionMin);
	sprintf(buf7, "%d", versionSec);
	sprintf(buf8, "%d", versionMDay);
	sprintf(buf9, "%d", versionMon);
	sprintf(buf10, "%d", versionYear);

	return processFile(in, out, sIn, sOut);
};

void Application::showUsage() {
#ifdef XYO_VERSION_INTERNAL
	printf("xyo-version\n");
#else
	printf("xyo-version - version %s build %s [%s]\n", XYO::Version::Version::getVersion(), XYO::Version::Version::getBuild(), XYO::Version::Version::getDatetime());
#endif
	printf("%s\n\n", XYO::Version::Copyright::fullCopyright());

	printf("%s\n",
	       "options:\n"
	       "    --app name          set application name\n"
	       "    --file-in name      input file\n"
	       "    --file-out name     output file\n"
	       "    --h                 output is .h file\n"
	       "    --hpp               output is .hpp file\n"
	       "    --js                output is .js file\n"
	       "    --licence           show licence\n"
	       "    --no-update         does not update version file\n"
	       "    --php               output is .php file\n"
	       "    --parse-file        process [file-in]\n"
	       "    --version-in name   use file as version info input\n"
	       "    --version-out name  use file as version info output\n"
	       "    --xyo-cpp           generate an .hpp and .cpp file\n"
	       "    --xyo-c             generate an .h and .c file\n"
	      );
};

void Application::showLicence() {
	printf("%s", XYO::Version::Licence::content());
};

int Application::main(int cmdN, char *cmdS[]) {
	int k;
	int i;
	char *opt;
	int err;
	int outputIsH;
	int outputIsHpp;
	int outputIsJs;
	int outputIsPhp;
	int outputIsXyoCpp;
	int outputIsXyoC;
	int parseFile;
	int noUpdate;

	String versionIn;
	String versionOut;
	String fileName;
	TRedBlackTree<String, String > myVar;

	if (cmdN < 2) {
		showUsage();
		return 0;
	};

	initVersion();
	err = 0;

	outputIsH = 0;
	outputIsHpp = 0;
	outputIsJs = 0;
	outputIsPhp = 0;
	outputIsXyoCpp = 0;
	outputIsXyoC = 0;
	parseFile = 0;
	noUpdate = 0;

	sourceBegin = "";
	sourceEnd = "";

	for (i = 1; i < cmdN; ++i) {
		if (strncmp(cmdS[i], "--", 2) == 0) {
			opt = &cmdS[i][2];
			if (strcmp(opt, "app") == 0) {
				if (i + 1 < cmdN) {
					applicationName = cmdS[i + 1];
					++i;
				} else {
					err = 1;
				};
				continue;
			};
			if (strcmp(opt, "version-in") == 0) {
				if (i + 1 < cmdN) {
					versionIn = cmdS[i + 1];
					++i;
				} else {
					err = 1;
				};
				continue;
			};
			if (strcmp(opt, "version-out") == 0) {
				if (i + 1 < cmdN) {
					versionOut = cmdS[i + 1];
					++i;
				} else {
					err = 1;
				};
				continue;
			};
			if (strcmp(opt, "file-in") == 0) {
				if (i + 1 < cmdN) {
					fileIn = cmdS[i + 1];
					++i;
				} else {
					err = 1;
				};
				continue;
			};
			if (strcmp(opt, "file-out") == 0) {
				if (i + 1 < cmdN) {
					fileOut = cmdS[i + 1];
					++i;
				} else {
					err = 1;
				};
				continue;
			};
			if (strcmp(opt, "source-begin") == 0) {
				if (i + 1 < cmdN) {
					sourceBegin = cmdS[i + 1];
					++i;
				} else {
					err = 1;
				};
				continue;
			};
			if (strcmp(opt, "source-end") == 0) {
				if (i + 1 < cmdN) {
					sourceEnd = cmdS[i + 1];
					++i;
				} else {
					err = 1;
				};
				continue;
			};

			if (strcmp(opt, "code-export") == 0) {
				if (i + 1 < cmdN) {
					codeExport = cmdS[i + 1];
					if(codeExport.length()) {
						codeExport<<" ";
					};
					++i;
				} else {
					err = 1;
				};
				continue;
			};


			if (strcmp(opt, "source-begin-base64") == 0) {
				if (i + 1 < cmdN) {
					if(!Base64::decode(cmdS[i + 1],sourceBegin)) {
						printf("Error: source begin not in base64\n");
						return -1;
					};
					++i;
				} else {
					err = 1;
				};
				continue;
			};
			if (strcmp(opt, "source-end-base64") == 0) {
				if (i + 1 < cmdN) {
					if(!Base64::decode(cmdS[i + 1],sourceEnd)) {
						printf("Error: source begin not in base64\n");
						return -1;
					};
					++i;
				} else {
					err = 1;
				};
				continue;
			};

			if (strcmp(opt, "line-begin-base64") == 0) {
				if (i + 1 < cmdN) {
					if(!Base64::decode(cmdS[i + 1],lineBegin)) {
						printf("Error: line begin not in base64\n");
						return -1;
					};
					++i;
				} else {
					err = 1;
				};
				continue;
			};

			if (strcmp(opt, "code-export-base64") == 0) {
				if (i + 1 < cmdN) {
					if(!Base64::decode(cmdS[i + 1],codeExport)) {
						printf("Error: code export not in base64\n");
						return -1;
					};
					if(codeExport.length()) {
						codeExport<<" ";
					};
					++i;
				} else {
					err = 1;
				};
				continue;
			};


			if (strcmp(opt, "line-begin") == 0) {
				if (i + 1 < cmdN) {
					lineBegin=cmdS[i + 1];
					++i;
				} else {
					err = 1;
				};
				continue;
			};

			if (strcmp(opt, "licence") == 0) {
				showLicence();
				if (cmdN == 2) {
					return 0;
				};
				continue;
			} else if (strcmp(opt, "h") == 0) {
				outputIsH = 1;
			} else if (strcmp(opt, "hpp") == 0) {
				outputIsHpp = 1;
			} else if (strcmp(opt, "js") == 0) {
				outputIsJs = 1;
			} else if (strcmp(opt, "php") == 0) {
				outputIsPhp = 1;
			} else if (strcmp(opt, "xyo-cpp") == 0) {
				outputIsXyoCpp = 1;
			} else if (strcmp(opt, "xyo-c") == 0) {
				outputIsXyoC = 1;
			} else if (strcmp(opt, "parse-file") == 0) {
				parseFile = 1;
			} else if (strcmp(opt, "no-update") == 0) {
				noUpdate = 1;
			};
		} else {
			err = 1;
			break;
		};
	};

	if (err) {
		printf("Error 1: Invalid arguments\n");
		return 1;
	};

	if (applicationName.length() == 0) {
		printf("Error 2: Invalid arguments\n");
		return 1;
	};


	varFileName = applicationName;
	varFileName << "-version.txt";


	if (versionIn.length() > 0) {
		varFileName = versionIn;
	};

	loadVarFile(varFileName, myVar);
	getVar(myVar);

	if (noUpdate == 0) {

		++versionD;
		setTime();

		if (versionOut.length() > 0) {
			varFileName = versionOut;
		};

		setVar(myVar);
		saveVarFile(varFileName, myVar);
	};

	if (outputIsH) {
		fileName = applicationName;
		fileName << "-version.h";
		if (fileOut.length() > 0) {
			fileName = fileOut;
		};
		writeToFileH(fileName);
	};

	if (outputIsHpp) {
		fileName = applicationName;
		fileName << "-version.hpp";
		if (fileOut.length() > 0) {
			fileName = fileOut;
		};
		writeToFileHpp(fileName);
	};

	if (outputIsJs) {
		fileName = applicationName;
		fileName << "-version.js";
		if (fileOut.length() > 0) {
			fileName = fileOut;
		};
		writeToFileJs(fileName);
	};

	if (outputIsXyoCpp) {
		fileName = applicationName;
		if (fileOut.length() > 0) {
			fileName = fileOut;
		};
		writeToFileXyoCpp(fileName);
	};

	if (outputIsXyoC) {
		fileName = applicationName;
		if (fileOut.length() > 0) {
			fileName = fileOut;
		};
		writeToFileXyoC(fileName);
	};

	if (parseFile) {
		if (fileIn.length() == 0) {
			printf("Error 3: Invalid arguments\n");
			return 1;
		};
		if (fileOut.length() == 0) {
			printf("Error 4: Invalid arguments\n");
			return 1;
		};
		doParseFile(fileIn, fileOut);
	};

	return 0;
};

void Application::memoryInit() {
	String::memoryInit();
	Error::memoryInit();
	TRedBlackTree<String, String >::memoryInit();
};


XYO_XY_MAIN_STD(Application);

