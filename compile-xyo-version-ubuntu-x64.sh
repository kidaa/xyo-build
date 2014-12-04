#!/bin/sh
SRC=""

SRC="$SRC xyo-version.cpp"
SRC="$SRC xyo-version-copyright.cpp"
SRC="$SRC xyo-version-licence.cpp"

XLIB="../libxyo-xy"
SRC="$SRC $XLIB/xyo-xy-object.cpp"
SRC="$SRC $XLIB/xyo-xy-xcriticalsection--os-unix.cpp"
SRC="$SRC $XLIB/xyo-xy-xregistryprocess.cpp"
SRC="$SRC $XLIB/xyo-xy-xregistrythread.cpp"
SRC="$SRC $XLIB/xyo-xy-xthread--os-unix.cpp"
SRC="$SRC $XLIB/xyo-xy-imain.cpp"

XLIB="../libxyo-xo"
SRC="$SRC $XLIB/xyo-xo-error.cpp"
SRC="$SRC $XLIB/xyo-xo-stringbasebyte.cpp"
SRC="$SRC $XLIB/xyo-xo-stringreferencebyte.cpp"
SRC="$SRC $XLIB/xyo-xo-stringbytex.cpp"
SRC="$SRC $XLIB/xyo-xo-string.cpp"
SRC="$SRC $XLIB/xyo-xo-file.cpp"
SRC="$SRC $XLIB/xyo-xo-memoryfileread.cpp"
SRC="$SRC $XLIB/xyo-xo-shell--os-unix.cpp"
SRC="$SRC $XLIB/xyo-xo-console--os-unix.cpp"
SRC="$SRC $XLIB/xyo-xo-datetime--os-unix.cpp"
SRC="$SRC $XLIB/xyo-xo-base64.cpp"

INC=""
INC="$INC -Ilibrary"
INC="$INC -I../libxyo-xy"
INC="$INC -I../libxyo-xo"

DEF=""
DEF="$DEF -DXYO_OS_TYPE_UNIX"
DEF="$DEF -DXYO_MACHINE_64BIT"
DEF="$DEF -DXYO_COMPILER_GNU"
DEF="$DEF -DXYO_XY_INTERNAL"
DEF="$DEF -DXYO_XO_INTERNAL"
DEF="$DEF -DLIBXYO_XY_NO_VERSION"
DEF="$DEF -DLIBXYO_XO_NO_VERSION"
DEF="$DEF -DXYO_VERSION_NO_VERSION"

#DEF="$DEF -DXYO_MEMORY_LEAK_DETECTOR"
#DEF="$DEF -DXYO_MEMORYPOOL_FORCE_SYSTEM"
#DEF="$DEF -DXYO_MEMORYPOOL_INFO"
#DEF="$DEF -DXYO_MEMORYSINGLETON_INFO"
#DEF="$DEF -DXYO_OBJECT_COUNTING_DEBUG"
#DEF="$DEF -DXYO_OBJECT_MANAGEMENT_DEBUG"
#DEF="$DEF -DXYO_SINGLE_THREAD"

gcc -o xyo-version -std=c++11 -std=gnu++11 -fpermissive $DEF $INC $SRC -lstdc++ -lpthread -ldl -lm

rm -f *.o
