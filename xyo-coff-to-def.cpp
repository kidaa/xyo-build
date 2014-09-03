//
// XYO Coff To Def
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include <windows.h>
#include <stdio.h>
#include <string.h>


#include "libxyo-xy.hpp"
#include "libxyo-xo.hpp"
#include "xyo-coff-to-def-version.hpp"
#include "xyo-coff-to-def-licence.hpp"
#include "xyo-coff-to-def-copyright.hpp"

using namespace XYO;
using namespace XYO::XY;
using namespace XYO::XO;

namespace{
using XYO::byte;

class Application :
	public virtual IMain {
		XYO_XY_DEFINE_PRIVATE_COPY(Application);
	protected:

		void getCoffSymbolsFromFile(PTSTR pszFileName, TRedBlackTreeOne<String > &retV, int showCoffSymbols);
		int generateDefFile(TRedBlackTreeOne<String > &inList, PTSTR pszFileName, int mode);

		void showUsage();
		void showLicence();
	public:
		inline Application() {};
		int main(int cmdN, char *cmdS[]);
		static void memoryInit();
};

void Application::getCoffSymbolsFromFile(PTSTR pszFileName, TRedBlackTreeOne<String > &retV, int showCoffSymbols) {
	HANDLE hFile;
	HANDLE hFileMapping;
	PVOID pMemoryMappedFileBase;
	PIMAGE_FILE_HEADER pFileHdr;
	PIMAGE_SYMBOL pSymbol;
	PIMAGE_SYMBOL pSymbolEnd;
	PSTR pStringTable;
	PSTR pszName;
	char shortName[9];

	hFile = CreateFile(pszFileName, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
	if (hFile != INVALID_HANDLE_VALUE) {
		hFileMapping = CreateFileMapping(hFile, NULL, PAGE_READONLY, 0, 0, NULL);
		if (hFileMapping != NULL) {
			pMemoryMappedFileBase = MapViewOfFile(hFileMapping, FILE_MAP_READ, 0, 0, 0);
			if (pMemoryMappedFileBase != NULL) {
				pFileHdr = (PIMAGE_FILE_HEADER) pMemoryMappedFileBase;
				if ((pFileHdr->Machine == IMAGE_FILE_MACHINE_I386) ||
				    (pFileHdr->Machine == IMAGE_FILE_MACHINE_AMD64)) {

					if (showCoffSymbols) {
						printf("Coff Symbols: %s\n\n", pszFileName);
					};

					pSymbol = (PIMAGE_SYMBOL) ((DWORD) pFileHdr + ((DWORD) pFileHdr->PointerToSymbolTable));
					pSymbolEnd = pSymbol + pFileHdr->NumberOfSymbols;
					pStringTable = (PSTR) pSymbolEnd;

					for (; pSymbol < pSymbolEnd; pSymbol += (pSymbol->NumberOfAuxSymbols + 1)) {
						if (pSymbol->StorageClass == IMAGE_SYM_CLASS_EXTERNAL) {
							if (pSymbol->SectionNumber == IMAGE_SYM_UNDEFINED) {
								continue;
							};
							if (pSymbol->N.Name.Short) {
								memset(shortName, 0, 9);
								memcpy(shortName, pSymbol->N.ShortName, 8);
								pszName = shortName;
							} else {
								pszName = pStringTable + pSymbol->N.Name.Long;
							};

							if (showCoffSymbols) {
								printf("%s\n", pszName);
							};

							retV.set(pszName);
						};
					};
				};

				UnmapViewOfFile(pMemoryMappedFileBase);
			};
			CloseHandle(hFileMapping);

		};
		CloseHandle(hFile);
	};
};

int Application::generateDefFile(TRedBlackTreeOne<String > &inList, PTSTR pszFileName, int mode) {
	FILE *out;
	int retV;
	retV = 0;
	out = fopen(pszFileName, "wb");
	if (out != NULL) {
		fprintf(out, "%s", "LIBRARY\r\nEXPORTS\r\n");
		TXRedBlackTreeNodeOne<String > *i;
		for (i = inList.begin(); i; i = i->succesor()) {
			if (StringBase::beginWith(i->value, "__real@")) {
				continue;
			};
			if (StringBase::beginWith(i->value, "??_")) {
				continue;
			};
			if (StringBase::beginWith(i->value, "__CT??")) {
				continue;
			};
			if (i->value == "__CTA1_N") {
				continue;
			};
			if (StringBase::beginWith(i->value, "__CTA2?")) {
				continue;
			};
			if (i->value == "__TI1_N") {
				continue;
			};
			if (StringBase::beginWith(i->value, "__TI2?")) {
				continue;
			};
			if (StringBase::beginWith(i->value, "__CTA1?AV")) {
				continue;
			};
			if (StringBase::beginWith(i->value, "__CTA2PAV")) {
				continue;
			};
			if (StringBase::beginWith(i->value, "__TI1?AV")) {
				continue;
			};
			if (StringBase::beginWith(i->value, "__TI2PAV")) {
				continue;
			};
			if (StringBase::beginWith(i->value, "__mask@@")) {
				continue;
			};
			if (StringBase::beginWith(i->value, "__xmm@")) {
				continue;
			};



			if (mode == 0) {
				if (StringBase::beginWith(i->value, "_")) {
					size_t index;
					if(StringBase::indexOf(i->value, "@",index)) {
						fwrite(i->value.value(), 1, i->value.length(), out);
					} else {
						fwrite(i->value.index(1), 1, i->value.length() - 1, out);
					};
					fwrite("\r\n", 1, 2, out);
				};
				if (StringBase::beginWith(i->value, "?")) {
					fwrite(i->value.value(), 1, i->value.length(), out);
					fwrite("\r\n", 1, 2, out);
				};
			} else if (mode == 1) {
				fwrite(i->value.value(), 1, i->value.length(), out);
				fwrite("\r\n", 1, 2, out);
			};
		};

		fclose(out);
		retV = 1;
	};
	return retV;
};

void Application::showUsage() {
	printf("xyo-coff-to-def - version %s build %s [%s]\n", XYO::CoffToDef::Version::getVersion(), XYO::CoffToDef::Version::getBuild(), XYO::CoffToDef::Version::getDatetime());
	printf("%s\n\n", XYO::CoffToDef::Copyright::fullCopyright());
	printf("%s\n",
	       "usage:\n"
	       "    xyo-coff-to-def [--out file] [--mode type] [--show] foo1.obj foo2.obj ...\n\n"
	       "options:\n"
	       "    --out file     output file (default out.def)\n"
	       "    --mode type    mode of operation [ WIN32 | WIN64 ]\n"
	       "    --licence      show licence\n"
	       "    --show         show coff symbols\n"
	      );
};

void Application::showLicence() {
	printf("%s", XYO::CoffToDef::Licence::content());
};

int Application::main(int cmdN, char *cmdS[]) {
	TRedBlackTreeOne<String > coffList;
	TRedBlackTreeOne<String > defList;
	int i;
	char *opt;
	char *defFile;
	int coffMode;
	int showCoffSymbols;
	TXRedBlackTreeNodeOne<String> *coff;

	showCoffSymbols = 0;
	defFile = "out.def";
	coffMode = 0;

	if (cmdN < 2) {
		showUsage();
		return 0;
	};

	for (i = 1; i < cmdN; ++i) {
		if (strncmp(cmdS[i], "--", 2) == 0) {
			opt = &cmdS[i][2];
			if (strcmp(opt, "out") == 0) {
				if (i + 1 < cmdN) {
					defFile = cmdS[i + 1];
					++i;
				};
				continue;
			} else if (strcmp(opt, "mode") == 0) {
				if (i + 1 < cmdN) {
					if (strcmp(cmdS[i + 1], "WIN32") == 0) {
						coffMode = 0;
					};
					if (strcmp(cmdS[i + 1], "WIN64") == 0) {
						coffMode = 1;
					};
					++i;
				};
				continue;
			};
			if (strcmp(opt, "licence") == 0) {
				showLicence();
			};
			if (strcmp(opt, "show") == 0) {
				showCoffSymbols = 1;
			};
		} else {
			coffList.set(cmdS[i]);
		};
	};


	for (coff = coffList.begin(); coff; coff = coff->succesor()) {
		if(coff->value[0]=='@') {
			FILE *in;
			in=fopen((char *)&(coff->value.value())[1],"rb");
			if(in!=NULL) {
				int k;
				char buffer[1024];
				while(fgets(buffer,1024,in)) {
					if(buffer[0]=='/') {
						if(buffer[1]=='/') {
							continue;
						};
					};
					for(k=strlen(buffer); k>=0; --k) {
						if(buffer[k]=='\r') {
							buffer[k]=0;
						};
						if(buffer[k]=='\n') {
							buffer[k]=0;
						};
					};
					getCoffSymbolsFromFile((PTSTR) buffer, defList, showCoffSymbols);
				};
				fclose(in);
			};
		} else {
			getCoffSymbolsFromFile((PTSTR) coff->value.value(), defList, showCoffSymbols);
		};
	};

	if (generateDefFile(defList, defFile, coffMode)) {
	} else {
		printf("Error: unable to generate def file %s\n", defFile);
		return 1;
	};

	return 0;
};

void Application::memoryInit() {
	String::memoryInit();
	Error::memoryInit();
	TMemory<TRedBlackTreeOne<String > >::memoryInit();
};

};

XYO_XY_MAIN_STD(Application);

