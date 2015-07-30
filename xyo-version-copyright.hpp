//
// XYO Version
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef XYO_VERSION_COPYRIGHT_HPP
#define XYO_VERSION_COPYRIGHT_HPP

#define XYO_VERSION_COPYRIGHT            "Copyright (C) Grigore Stefan."
#define XYO_VERSION_PUBLISHER            "Grigore Stefan"
#define XYO_VERSION_COMPANY              XYO_VERSION_PUBLISHER
#define XYO_VERSION_CONTACT              "g_stefan@yahoo.com"
#define XYO_VERSION_FULL_COPYRIGHT       XYO_VERSION_COPYRIGHT " <" XYO_VERSION_CONTACT ">"

#ifndef XYO_RC

namespace XYO {
	namespace Version {

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
