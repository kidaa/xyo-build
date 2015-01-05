#ifndef XYO_BUILD_VERSION_HPP
#define XYO_BUILD_VERSION_HPP

#define XYO_BUILD_VERSION_ABCD      1,4,0,19
#define XYO_BUILD_VERSION_A         1
#define XYO_BUILD_VERSION_B         4
#define XYO_BUILD_VERSION_C         0
#define XYO_BUILD_VERSION_D         19
#define XYO_BUILD_VERSION_STR_ABCD  "1.4.0.19"
#define XYO_BUILD_VERSION_STR       "1.4.0"
#define XYO_BUILD_VERSION_STR_BUILD "19"
#define XYO_BUILD_VERSION_BUILD     19
#define XYO_BUILD_VERSION_HOUR      10
#define XYO_BUILD_VERSION_MINUTE    20
#define XYO_BUILD_VERSION_SECOND    4
#define XYO_BUILD_VERSION_DAY       5
#define XYO_BUILD_VERSION_MONTH     1
#define XYO_BUILD_VERSION_YEAR      2015
#define XYO_BUILD_VERSION_STR_DATETIME "2015-01-05 10:20:04"

#ifndef XYO_RC

namespace XYO{
	namespace Build{

		class Version{
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

