@echo off                        
set SRC=

set SRC=%SRC% xyo-coff-to-def.cpp
set SRC=%SRC% xyo-coff-to-def-copyright.cpp
set SRC=%SRC% xyo-coff-to-def-licence.cpp
set SRC=%SRC% xyo-coff-to-def-version.cpp

set XLIB= ..\quantum-script\libxyo-xy\
set SRC=%SRC% %XLIB%xyo-xy-object.cpp
set SRC=%SRC% %XLIB%xyo-xy-xcriticalsection--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xy-xregistryprocess.cpp
set SRC=%SRC% %XLIB%xyo-xy-xregistrythread.cpp
set SRC=%SRC% %XLIB%xyo-xy-xthread--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xy-xregistry.cpp
set SRC=%SRC% %XLIB%xyo-xy-xregistrykey.cpp

set XLIB= ..\quantum-script\libxyo-xo\
set SRC=%SRC% %XLIB%xyo-xo-error.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringbasebyte.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringreferencebyte.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringbytex.cpp
set SRC=%SRC% %XLIB%xyo-xo-string.cpp
set SRC=%SRC% %XLIB%xyo-xo-file.cpp
set SRC=%SRC% %XLIB%xyo-xo-memoryfileread.cpp
set SRC=%SRC% %XLIB%xyo-xo-shell--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xo-console--os-win.cpp

set INC=
set INC= %INC% /I..\quantum-script\libxyo-xy
set INC= %INC% /I..\quantum-script\libxyo-xo

set DEF=
set DEF= %DEF% /DXYO_OS_TYPE_WIN
set DEF= %DEF% /DXYO_COMPILER_MSVC
set DEF= %DEF% /DXYO_MACHINE_32BIT
set DEF= %DEF% /DXYO_XY_INTERNAL
set DEF= %DEF% /DXYO_XO_INTERNAL
set DEF= %DEF% /DLIBXYO_XY_NO_VERSION
set DEF= %DEF% /DLIBXYO_XO_NO_VERSION
set DEF= %DEF% /DXYO_SINGLE_THREAD

rem set DEF= %DEF% /DXYO_MEMORY_LEAK_DETECTOR
rem set DEF= %DEF% /DXYO_MEMORYPOOL_FORCE_SYSTEM
rem set DEF= %DEF% /DXYO_MEMORYPOOL_INFO
rem set DEF= %DEF% /DXYO_OBJECT_COUNTING_DEBUG
rem set DEF= %DEF% /DXYO_OBJECT_MANAGEMENT_DEBUG

rem cl /Zi /MDd %DEF% %INC% %SRC%
cl /MT /O2 /Oi /Oy /GS- /GL /GA /Gr /EHs-c- /GR- /TP  %DEF%  %INC% %SRC% /link ws2_32.lib user32.lib

del *.ilk
del *.obj
del *.pdb

