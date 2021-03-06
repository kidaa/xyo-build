//
// XYO Coff To Def
//
// Copyright (c) 2014 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include "xyo-coff-to-def-copyright.hpp"

namespace XYO {
	namespace CoffToDef {

		static const char *copyright_ = "Copyright (C) Grigore Stefan.";
		static const char *publisher_ = "Grigore Stefan";
		static const char *company_ = "Grigore Stefan";
		static const char *contact_ = "g_stefan@yahoo.com";
		static const char *fullCopyright_ = "Copyright (C) Grigore Stefan. <g_stefan@yahoo.com>";

		const char *Copyright::copyright() {
			return copyright_;
		};

		const char *Copyright::publisher() {
			return publisher_;
		};

		const char *Copyright::company() {
			return company_;
		};

		const char *Copyright::contact() {
			return contact_;
		};

		const char *Copyright::fullCopyright() {
			return fullCopyright_;
		};

	};
};

