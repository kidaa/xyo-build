//
// XYO Coff To Def
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef XYO_COFF_TO_DEF_COPYRIGHT_HPP
#define XYO_COFF_TO_DEF_COPYRIGHT_HPP

#define XYO_COFF_TO_DEF_COPYRIGHT            "Copyright (C) Grigore Stefan."
#define XYO_COFF_TO_DEF_PUBLISHER            "Grigore Stefan"
#define XYO_COFF_TO_DEF_COMPANY              XYO_COFF_TO_DEF_PUBLISHER
#define XYO_COFF_TO_DEF_CONTACT              "g_stefan@yahoo.com"
#define XYO_COFF_TO_DEF_FULL_COPYRIGHT       XYO_COFF_TO_DEF_COPYRIGHT " <" XYO_COFF_TO_DEF_CONTACT ">"

#ifndef XYO_RC

namespace XYO {
	namespace CoffToDef {

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
