//+build darwin

#import <ApplicationServices/ApplicationServices.h>
#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>

#include "window.h"

void QueryWindows(void) {
	CFArrayRef windows = CGWindowListCopyWindowInfo(kCGWindowListExcludeDesktopElements, kCGNullWindowID);	

	for (NSDictionary *entry in (NSArray*) windows) {
		int number = [[entry objectForKey: (id) kCGWindowNumber] intValue];
		NSString *windowOwnerName = [entry objectForKey: (id) kCGWindowOwnerName];
		NSString *windowTitle = [entry objectForKey: (id) kCGWindowName];

		CGRect bounds;
        CGRectMakeWithDictionaryRepresentation([entry objectForKey: (id) kCGWindowBounds], &bounds);

		Frame frame;
		frame.handle = number;
		frame.visible = [[entry objectForKey: (id) kCGWindowIsOnscreen] boolValue];
		
		NSString *title;
		if (windowTitle == NULL) {
			title = windowOwnerName;
		} else if (windowOwnerName == NULL) {
			title = windowTitle;
		} else {
			title = [NSString stringWithFormat: @"%@ - %@", windowTitle, windowOwnerName];
		}

		frame.title = [title UTF8String];
		frame.rect.x = bounds.origin.x;
		frame.rect.y = bounds.origin.y;
		frame.rect.width = bounds.size.width;
		frame.rect.height = bounds.size.height;

		WindowCallback(frame);
	}

	CFRelease(windows);
}

void SetDisplayState(HANDLE handle, bool visible) {
	NSWindow *window = [NSApp windowWithWindowNumber: handle];
	[ window minitaturize ];
}