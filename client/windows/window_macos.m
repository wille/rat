//+build darwin

#import <ApplicationServices/ApplicationServices.h>

#include "window.h"

void QueryWindows(void) {
	CFArrayRef windows = CGWindowListCopyWindowInfo(kCGWindowListExcludeDesktopElements | kCGWindowListOptionOnScreenOnly, kCGNullWindowID);	

	for (NSDictionary *entry in (NSArray*) windows) {
		int number = [[entry objectForKey: (id) kCGWindowNumber] intValue];
		NSString* ownerName = [entry objectForKey: (id) kCGWindowName];

		CGRect bounds;
        CGRectMakeWithDictionaryRepresentation([entry objectForKey: (id) kCGWindowBounds], &bounds);

		Frame frame;
		frame.handle = number;
		frame.visible = false;
		frame.title = [ownerName UTF8String];
		frame.rect.x = bounds.origin.x;
		frame.rect.y = bounds.origin.y;
		frame.rect.width = bounds.size.width;
		frame.rect.height = bounds.size.height;

		WindowCallback(frame);
	}

	CFRelease(windows);
}
	
void SetDisplayState(HANDLE handle, bool visible) {
	
}