@echo off                        
set SRC=

set SRC=%SRC% xyo-build.cpp
set SRC=%SRC% xyo-build-copyright.cpp                      
set SRC=%SRC% xyo-build-licence.cpp

set XLIB= ..\quantum-script\library\

set SRC=%SRC% %XLIB%quantum-script-native-symbollist.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variable.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablenull.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variableboolean.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablenumber.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablestring.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablearray.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variableobject.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablefunction.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablefunctionwithyield.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variableresource.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variabledatetime.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablesymbol.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variableassociativearray.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablerandom.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablesocket.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablefile.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variableshellfind.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variableatomic.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablebuffer.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variablequitmessage.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variableutf16.cpp
set SRC=%SRC% %XLIB%quantum-script-native-variableutf32.cpp
set SRC=%SRC% %XLIB%quantum-script-native-context.cpp
set SRC=%SRC% %XLIB%quantum-script-native-prototype.cpp
set SRC=%SRC% %XLIB%quantum-script-native-iterator.cpp
set SRC=%SRC% %XLIB%quantum-script-native-arrayiteratorkey.cpp
set SRC=%SRC% %XLIB%quantum-script-native-objectiteratorkey.cpp
set SRC=%SRC% %XLIB%quantum-script-native-arrayiteratorvalue.cpp
set SRC=%SRC% %XLIB%quantum-script-native-objectiteratorvalue.cpp
set SRC=%SRC% %XLIB%quantum-script-native-shellfinditeratorvalue.cpp
set SRC=%SRC% %XLIB%quantum-script-native-associativearrayiteratorkey.cpp
set SRC=%SRC% %XLIB%quantum-script-native-associativearrayiteratorvalue.cpp

set SRC=%SRC% %XLIB%quantum-script-vm-input.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-token.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-break.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-continue.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-do.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-expression.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-for.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-function.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-if.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-return.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-yield.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-switch.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-throw.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-try.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-var.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-parser-while.cpp

set SRC=%SRC% %XLIB%quantum-script-vm-variablefiberinfo.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variablethreadinfo.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variablevmfunction.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variablevmprogramcounter.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-instructioncontext.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variablestacktrace.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variableargumentlevel.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variablereferenceobject.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variableoperator21.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variableoperator22.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variableoperator23.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variableoperator31.cpp

set SRC=%SRC% %XLIB%quantum-script-vm-asm.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-instruction.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-variablenativevmfunction.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-executive.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-executivex.cpp

set SRC=%SRC% %XLIB%quantum-script-vm-libstd.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdconsole.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstderror.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdscript.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdstring.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdfiber.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdthread.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdconvert.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdapplication.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdresource.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdmath.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstddatetime.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdbase64.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdmd5.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdrandom.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdsocket.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdfile.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdshellfind.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdshell.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdatomic.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdjson.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdbuffer.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdcsv.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdurl.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdutf16.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdutf32.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdsha256.cpp
set SRC=%SRC% %XLIB%quantum-script-vm-libstdsha512.cpp


set XLIB= ..\libxyo-xy\
set SRC=%SRC% %XLIB%xyo-xy-object.cpp
set SRC=%SRC% %XLIB%xyo-xy-xcriticalsection--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xy-xregistryprocess.cpp
set SRC=%SRC% %XLIB%xyo-xy-xregistrythread.cpp
set SRC=%SRC% %XLIB%xyo-xy-xthread--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xy-imain.cpp

set XLIB= ..\libxyo-xo\
set SRC=%SRC% %XLIB%xyo-xo-error.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringbasebyte.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringreferencebyte.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringbytex.cpp
set SRC=%SRC% %XLIB%xyo-xo-string.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringbaseword.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringreferenceword.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringwordx.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringbasedword.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringreferencedword.cpp
set SRC=%SRC% %XLIB%xyo-xo-stringdwordx.cpp
set SRC=%SRC% %XLIB%xyo-xo-utf8x.cpp
set SRC=%SRC% %XLIB%xyo-xo-utf16x.cpp
set SRC=%SRC% %XLIB%xyo-xo-utf32x.cpp
set SRC=%SRC% %XLIB%xyo-xo-utfx.cpp
set SRC=%SRC% %XLIB%xyo-xo-file.cpp
set SRC=%SRC% %XLIB%xyo-xo-filex.cpp
set SRC=%SRC% %XLIB%xyo-xo-memoryfileread.cpp
set SRC=%SRC% %XLIB%xyo-xo-shell--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xo-shellx.cpp
set SRC=%SRC% %XLIB%xyo-xo-console--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xo-datetime--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xo-md5hash.cpp
set SRC=%SRC% %XLIB%xyo-xo-base64.cpp
set SRC=%SRC% %XLIB%xyo-xo-randommt.cpp
set SRC=%SRC% %XLIB%xyo-xo-socket--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xo-net--os-win.cpp
set SRC=%SRC% %XLIB%xyo-xo-ip4.cpp
set SRC=%SRC% %XLIB%xyo-xo-ipaddress4.cpp
set SRC=%SRC% %XLIB%xyo-xo-sha256hash.cpp
set SRC=%SRC% %XLIB%xyo-xo-sha512hash.cpp

set INC=
set INC=
set INC= %INC% /I..\libxyo-xy
set INC= %INC% /I..\libxyo-xo
set INC= %INC% /I..\quantum-script\library
                                             
set DEF=
set DEF= %DEF% /DXYO_OS_TYPE_WIN
set DEF= %DEF% /DXYO_COMPILER_MSVC
set DEF= %DEF% /DXYO_MACHINE_32BIT
set DEF= %DEF% /DLIBXYO_XY_INTERNAL
set DEF= %DEF% /DLIBXYO_XO_INTERNAL
set DEF= %DEF% /DLIBQUANTUM_SCRIPT_INTERNAL
set DEF= %DEF% /DQUANTUM_SCRIPT_INTERNAL
set DEF= %DEF% /DXYO_BUILD_INTERNAL

rem set DEF= %DEF% /DXYO_MEMORY_LEAK_DETECTOR
rem set DEF= %DEF% /DXYO_OBJECT_COUNTING_DEBUG
rem set DEF= %DEF% /DXYO_OBJECT_MANAGEMENT_DEBUG
rem set DEF= %DEF% /DQUANTUM_SCRIPT_VM_DEBUG_ASM
rem set DEF= %DEF% /DQUANTUM_SCRIPT_VM_DEBUG_RUNTIME
rem set DEF= %DEF% /DQUANTUM_SCRIPT_VM_DISABLE_ASM_OPTIMIZER
rem set DEF= %DEF% /DXYO_SINGLE_THREAD
rem set DEF= %DEF% /DQUANTUM_SCRIPT_VM_SINGLE_FIBER 
rem set DEF= %DEF% /DQUANTUM_SCRIPT_VM_SINGLE_THREAD
rem set DEF= %DEF% /DQUANTUM_SCRIPT_VM_DISABLE_CLOSURE

rem set DEF= %DEF% /DXYO_XY_XREGISTRYPROCESS_DEBUG
rem set DEF= %DEF% /DXYO_XY_XREGISTRYTHREAD_DEBUG

rem cl /Zi /MDd /EHsc %DEF% %INC% %SRC% /link ws2_32.lib
cl /MT /O2 /Ox /Oy /GS- /GL /GA /Gr /EHsc /GR- /TP  %DEF%  %INC% %SRC% /link ws2_32.lib user32.lib

del *.ilk
del *.obj
del *.pdb
