#ifndef XYO_VERSION_VERSION_HPP
#define XYO_VERSION_VERSION_HPP

#define XYO_VERSION_VERSION_ABCD      2,0,0,20
#define XYO_VERSION_VERSION_A         2
#define XYO_VERSION_VERSION_B         0
#define XYO_VERSION_VERSION_C         0
#define XYO_VERSION_VERSION_D         20
#define XYO_VERSION_VERSION_STR_ABCD  "2.0.0.20"
#define XYO_VERSION_VERSION_STR       "2.0.0"
#define XYO_VERSION_VERSION_STR_BUILD "20"
#define XYO_VERSION_VERSION_BUILD     20
#define XYO_VERSION_VERSION_HOUR      0
#define XYO_VERSION_VERSION_MINUTE    6
#define XYO_VERSION_VERSION_SECOND    39
#define XYO_VERSION_VERSION_DAY       13
#define XYO_VERSION_VERSION_MONTH     5
#define XYO_VERSION_VERSION_YEAR      2015
#define XYO_VERSION_VERSION_STR_DATETIME "2015-05-13 00:06:39"

#ifndef XYO_RC

namespace XYO {
	namespace Version {

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

