//+build darwin

#import <ApplicationServices/ApplicationServices.h>
#import <Foundation/Foundation.h>

#include "window.h"

void QueryWindows(void) {
	CFArrayRef windows = CGWindowListCopyWindowInfo(kCGWindowListExcludeDesktopElements, kCGNullWindowID);	

	for (NSDictionary *entry in (NSArray*) windows) {
		int number = [[entry objectForKey: (id) kCGWindowNumber] intValue];
		NSString* ownerName = [entry objectForKey: (id) kCGWindowOwnerName];
		NSString* title = [entry objectForKey: (id) kCGWindowName];

		CGRect bounds;
        CGRectMakeWithDictionaryRepresentation([entry objectForKey: (id) kCGWindowBounds], &bounds);

		Frame frame;
		frame.handle = number;
		frame.visible = [[entry objectForKey: (id) kCGWindowIsOnscreen] boolValue];
		frame.title = [[NSString stringWithFormat:@"%@ - %@", title, ownerName] UTF8String];
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