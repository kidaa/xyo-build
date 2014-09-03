#ifndef XYO_VERSION_VERSION_HPP
#define XYO_VERSION_VERSION_HPP

#define XYO_VERSION_VERSION_ABCD      1,2,0,18
#define XYO_VERSION_VERSION_A         1
#define XYO_VERSION_VERSION_B         2
#define XYO_VERSION_VERSION_C         0
#define XYO_VERSION_VERSION_D         18
#define XYO_VERSION_VERSION_STR_ABCD  "1.2.0.18"
#define XYO_VERSION_VERSION_STR       "1.2.0"
#define XYO_VERSION_VERSION_STR_BUILD "18"
#define XYO_VERSION_VERSION_BUILD     18
#define XYO_VERSION_VERSION_HOUR      23
#define XYO_VERSION_VERSION_MINUTE    27
#define XYO_VERSION_VERSION_SECOND    36
#define XYO_VERSION_VERSION_DAY       2
#define XYO_VERSION_VERSION_MONTH     9
#define XYO_VERSION_VERSION_YEAR      2014
#define XYO_VERSION_VERSION_STR_DATETIME "2014-09-02 23:27:36"

#ifndef XYO_RC

namespace XYO{
	namespace Version{

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

