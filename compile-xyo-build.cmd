@echo off                        

set SRC=

set SRC=%SRC% xyo-build.cpp
set SRC=%SRC% xyo-build-copyright.cpp
set SRC=%SRC% xyo-build-licence.cpp

set INC=
set INC= %INC% /I..\quantum-script
set INC= %INC% /I..\quantum-script\libquantum-script
set INC= %INC% /I..\quantum-script\libxyo-xy
set INC= %INC% /I..\quantum-script\libxyo-xo

set DEF=
set DEF= %DEF% /DXYO_OS_TYPE_WIN
set DEF= %DEF% /DXYO_COMPILER_MSVC
set DEF= %DEF% /DXYO_MACHINE_32BIT
set DEF= %DEF% /DXYO_XY_INTERNAL
set DEF= %DEF% /DXYO_XO_INTERNAL
set DEF= %DEF% /DQUANTUM_SCRIPT_INTERNAL
set DEF= %DEF% /DLIBXYO_XY_NO_VERSION
set DEF= %DEF% /DLIBXYO_XO_NO_VERSION
set DEF= %DEF% /DLIBQUANTUM_SCRIPT_NO_VERSION
set DEF= %DEF% /DQUANTUM_SCRIPT_NO_VERSION
set DEF= %DEF% /DQUANTUM_SCRIPT_AMALGAM
set DEF= %DEF% /DXYO_BUILD_NO_VERSION

rem set DEF= %DEF% /D_CRT_SECURE_NO_WARNINGS
rem set DEF= %DEF% /DXYO_MEMORY_LEAK_DETECTOR
rem set DEF= %DEF% /DXYO_MEMORYPOOL_FORCE_ACTIVE_MEMORY_AS_SYSTEM
rem set DEF= %DEF% /DQUANTUM_SCRIPT_DEBUG_ASM
rem set DEF= %DEF% /DQUANTUM_SCRIPT_DEBUG_RUNTIME
rem set DEF= %DEF% /DQUANTUM_SCRIPT_DEBUG_LIBSTD_INIT
rem set DEF= %DEF% /DQUANTUM_SCRIPT_DISABLE_ASM_OPTIMIZER
rem set DEF= %DEF% /DXYO_SINGLE_THREAD
rem set DEF= %DEF% /DQUANTUM_SCRIPT_SINGLE_FIBER 
rem set DEF= %DEF% /DQUANTUM_SCRIPT_SINGLE_THREAD
rem set DEF= %DEF% /DQUANTUM_SCRIPT_DISABLE_CLOSURE

rem cl /Zi /MDd /EHsc %DEF% %INC% %SRC% /link ws2_32.lib user32.lib
cl /MT /O2 /Ox /Oy /GS- /GL /GA /EHsc /GR- /TP  %DEF%  %INC% %SRC% /link ws2_32.lib user32.lib
rem cl /RTCs /RTCu /MD  /Oy /GS /GL /GA /EHsc /GR /TP  %DEF%  %INC% %SRC% /link ws2_32.lib user32.lib

del *.ilk
del *.obj
del *.pdb
