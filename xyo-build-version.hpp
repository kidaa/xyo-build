#ifndef XYO_BUILD_VERSION_HPP
#define XYO_BUILD_VERSION_HPP

#define XYO_BUILD_VERSION_ABCD      2,2,0,22
#define XYO_BUILD_VERSION_A         2
#define XYO_BUILD_VERSION_B         2
#define XYO_BUILD_VERSION_C         0
#define XYO_BUILD_VERSION_D         22
#define XYO_BUILD_VERSION_STR_ABCD  "2.2.0.22"
#define XYO_BUILD_VERSION_STR       "2.2.0"
#define XYO_BUILD_VERSION_STR_BUILD "22"
#define XYO_BUILD_VERSION_BUILD     22
#define XYO_BUILD_VERSION_HOUR      18
#define XYO_BUILD_VERSION_MINUTE    45
#define XYO_BUILD_VERSION_SECOND    31
#define XYO_BUILD_VERSION_DAY       14
#define XYO_BUILD_VERSION_MONTH     6
#define XYO_BUILD_VERSION_YEAR      2015
#define XYO_BUILD_VERSION_STR_DATETIME "2015-06-14 18:45:31"

#ifndef XYO_RC

namespace XYO {
	namespace Build {

		class Version {
			public:
				static const char *getABCD();
				static const char *getA();
				static const char *getB();
				static const char *getC();
				static const char *getD();
				static const char *getVersion();
				static const char *getBuild();
				static const char *getHour();
				static const char *getMinute();
				static const char *getSecond();
				static const char *getDay();
				static const char *getMonth();
				static const char *getYear();
				static const char *getDatetime();
		};

	};
};

#endif
#endif

