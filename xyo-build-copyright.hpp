//
// XYO Build
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef XYO_BUILD_COPYRIGHT_HPP
#define XYO_BUILD_COPYRIGHT_HPP

#define XYO_BUILD_COPYRIGHT            "Copyright (C) Grigore Stefan."
#define XYO_BUILD_PUBLISHER            "Grigore Stefan"
#define XYO_BUILD_COMPANY              XYO_BUILD_PUBLISHER
#define XYO_BUILD_CONTACT              "g_stefan@yahoo.com"
#define XYO_BUILD_FULL_COPYRIGHT       XYO_BUILD_COPYRIGHT " <" XYO_BUILD_CONTACT ">"

#ifndef XYO_RC

namespace XYO {
	namespace Build {

		class Copyright {
			public:
				static const char *copyright();
				static const char *publisher();
				static const char *company();
				static const char *contact();
				static const char *fullCopyright();

		};

	};
};

#endif
#endif
