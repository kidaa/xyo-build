@echo off
@pushd "C:\Program Files (x86)\Microsoft Visual Studio 12.0\VC\"
@call vcvarsall.bat x86_amd64
@popd
@rem ------ win 8.1 sdk
@set PATH=C:\Program Files (x86)\Windows Kits\8.1\bin\x64;%PATH%
@set INCLUDE=C:\Program Files (x86)\Windows Kits\8.1\Include\um;%INCLUDE%
@set LIB=C:\Program Files (x86)\Windows Kits\8.1\Lib\winv6.3\um\x64;%LIB%
@rem ------------------------------------------
@set XYO_BUILD_PLATFORM=win64-msvc-express-native
@set XYO_OS=WIN64
@set XYO_PATH_BASE=C:\MySoftware\
@set XYO_PATH_REPOSITORY=%XYO_PATH_BASE%Repository\
@set XYO_PATH_BIN=%XYO_PATH_REPOSITORY%win64-msvc-express-native\
@rem ------ digital signature
@set PATH=%XYO_PATH_BASE%Certificate\bin;%PATH%
@rem ------ visual leak detector
@set PATH=C:\Program Files (x86)\Visual Leak Detector\bin\Win64;%PATH%
@set INCLUDE=C:\Program Files (x86)\Visual Leak Detector\include;%INCLUDE%
@set LIB=C:\Program Files (x86)\Visual Leak Detector\lib\Win64;%LIB%
@rem ------ DirectX
@set INCLUDE=C:\Program Files (x86)\Microsoft DirectX SDK (June 2010)\Include;%INCLUDE%
@set LIB=C:\Program Files (x86)\Microsoft DirectX SDK (June 2010)\Lib\x64;%LIB%
@rem ------
@set PATH=%XYO_PATH_BIN%.unify\bin;%PATH%
@set INCLUDE=%XYO_PATH_BIN%.unify\include;%INCLUDE%
@set LIB=%XYO_PATH_BIN%.unify\lib;%LIB%
@rem ------
@c:
@cd "C:\Program Files (x86)\Far Manager"
@Far.exe
