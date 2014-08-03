#ifndef XYO_BUILD_VERSION_HPP
#define XYO_BUILD_VERSION_HPP

#define XYO_BUILD_VERSION_ABCD      1,2,1,16
#define XYO_BUILD_VERSION_A         1
#define XYO_BUILD_VERSION_B         2
#define XYO_BUILD_VERSION_C         1
#define XYO_BUILD_VERSION_D         16
#define XYO_BUILD_VERSION_STR_ABCD  "1.2.1.16"
#define XYO_BUILD_VERSION_STR       "1.2.1"
#define XYO_BUILD_VERSION_STR_BUILD "16"
#define XYO_BUILD_VERSION_BUILD     16
#define XYO_BUILD_VERSION_HOUR      2
#define XYO_BUILD_VERSION_MINUTE    30
#define XYO_BUILD_VERSION_SECOND    46
#define XYO_BUILD_VERSION_DAY       23
#define XYO_BUILD_VERSION_MONTH     6
#define XYO_BUILD_VERSION_YEAR      2014
#define XYO_BUILD_VERSION_STR_DATETIME "2014-06-23 02:30:46"

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

