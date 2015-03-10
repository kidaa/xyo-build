#!/bin/sh

SRC=""

SRC="$SRC xyo-build.cpp"
SRC="$SRC xyo-build-copyright.cpp"
SRC="$SRC xyo-build-licence.cpp"

XLIB="../quantum-script/libxyo-xy"
SRC="$SRC $XLIB/xyo-xy-xregistryprocess.cpp"
SRC="$SRC $XLIB/xyo-xy-xregistrythread.cpp"

INC=""
INC="$INC -I../quantum-script"
INC="$INC -I../quantum-script/libquantum-script"
INC="$INC -I../quantum-script/libxyo-xy"
INC="$INC -I../quantum-script/libxyo-xo"

DEF=""
DEF="$DEF -DXYO_OS_TYPE_UNIX"
DEF="$DEF -DXYO_MACHINE_64BIT"
DEF="$DEF -DXYO_COMPILER_GNU"
DEF="$DEF -DXYO_XY_INTERNAL"
DEF="$DEF -DXYO_XO_INTERNAL"
DEF="$DEF -DQUANTUM_SCRIPT_INTERNAL"
DEF="$DEF -DLIBXYO_XY_NO_VERSION"
DEF="$DEF -DLIBXYO_XO_NO_VERSION"
DEF="$DEF -DLIBQUANTUM_SCRIPT_NO_VERSION"
DEF="$DEF -DQUANTUM_SCRIPT_NO_VERSION"
DEF="$DEF -DQUANTUM_SCRIPT_AMALGAM"
DEF="$DEF -DXYO_BUILD_NO_VERSION"

#DEF="$DEF -DXYO_MEMORY_LEAK_DETECTOR"
#DEF="$DEF -DXYO_SINGLE_THREAD"
#DEF="$DEF -DQUANTUM_SCRIPT_DEBUG_ASM"
#DEF="$DEF -DQUANTUM_SCRIPT_DEBUG_RUNTIME"
#DEF="$DEF -DQUANTUM_SCRIPT_DISABLE_ASM_OPTIMIZER"
#DEF="$DEF -DQUANTUM_SCRIPT_SINGLE_FIBER"
#DEF="$DEF -DQUANTUM_SCRIPT_SINGLE_THREAD"
#DEF="$DEF -DQUANTUM_SCRIPT_DISABLE_CLOSURE"

gcc -o quantum-script -std=c++11 -std=gnu++11 -fpermissive $DEF $INC $SRC -lstdc++ -lpthread -ldl -lm

rm -f *.o
