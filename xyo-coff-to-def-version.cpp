#include "xyo-coff-to-def-version.hpp"

namespace XYO {
	namespace CoffToDef {

		static const char *version_abcd_="1.1.0.16";
		static const char *version_a_="1";
		static const char *version_b_="1";
		static const char *version_c_="0";
		static const char *version_d_="16";
		static const char *version_version_="1.1.0";
		static const char *version_build_="16";
		static const char *version_hour_="2";
		static const char *version_minute_="30";
		static const char *version_second_="46";
		static const char *version_day_="23";
		static const char *version_month_="6";
		static const char *version_year_="2014";
		static const char *version_datetime_="2014-06-23 02:30:46";

		const char *Version::getABCD() {
			return version_abcd_;
		};
		const char *Version::getA() {
			return version_a_;
		};
		const char *Version::getB() {
			return version_b_;
		};
		const char *Version::getC() {
			return version_c_;
		};
		const char *Version::getD() {
			return version_d_;
		};
		const char *Version::getVersion() {
			return version_version_;
		};
		const char *Version::getBuild() {
			return version_build_;
		};
		const char *Version::getHour() {
			return version_hour_;
		};
		const char *Version::getMinute() {
			return version_minute_;
		};
		const char *Version::getSecond() {
			return version_second_;
		};
		const char *Version::getDay() {
			return version_day_;
		};
		const char *Version::getMonth() {
			return version_month_;
		};
		const char *Version::getYear() {
			return version_year_;
		};
		const char *Version::getDatetime() {
			return version_datetime_;
		};

	};
};


