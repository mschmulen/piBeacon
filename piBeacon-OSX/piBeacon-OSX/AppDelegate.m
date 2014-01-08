//
//  AppDelegate.m
//  piBeacon-OSX
//
//  Created by Matthew Schmulen on 1/5/14.
//  Copyright (c) 2014 Matthew Schmulen. All rights reserved.
//

#import "AppDelegate.h"
#import <IOBluetooth/IOBluetooth.h>


@interface AppDelegate () <CBPeripheralManagerDelegate, NSTextFieldDelegate>
@property (weak) IBOutlet NSTextField *textFieldUUID;
@property (weak) IBOutlet NSTextField *textFieldMajor;
@property (weak) IBOutlet NSTextField *textFieldMinor;
@property (weak) IBOutlet NSTextField *textFieldPower;
@property (weak) IBOutlet NSButton *buttonStart;

@property (nonatomic,strong) CBPeripheralManager *manager;

@end


@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{
    _manager = [[CBPeripheralManager alloc] initWithDelegate:self queue:nil];
    
    [self.buttonStart setEnabled:NO];
}

- (IBAction)actionStart:(id)sender {
    
    NSLog(@" Start broadcasting");
    
    if (_manager.isAdvertising) {
        [_manager stopAdvertising];
        [[self buttonStart] setTitle:@"startAdvertising"];
        [self.textFieldUUID setEnabled:YES];
        [self.textFieldMajor setEnabled:YES];
        [self.textFieldMinor setEnabled:YES];
        [self.textFieldPower setEnabled:YES];
     } else {
         
         NSUUID *proximityUUID = [[NSUUID alloc] initWithUUIDString:[self.textFieldUUID stringValue]];
         
         
         NSString *beaconKey = @"kCBAdvDataAppleBeaconKey";
         unsigned char advertisementBytes[21] = {0};
         [proximityUUID getUUIDBytes:(unsigned char *)&advertisementBytes];
         
         advertisementBytes[16] = (unsigned char)(self.textFieldMajor.integerValue >> 8);
         advertisementBytes[17] = (unsigned char)(self.textFieldMajor.integerValue & 255);
         
         advertisementBytes[18] = (unsigned char)(self.textFieldMinor.integerValue >> 8);
         advertisementBytes[19] = (unsigned char)(self.textFieldMinor.integerValue & 255);
         
         advertisementBytes[20] = self.textFieldPower.integerValue;
         
         NSMutableData *advertisement = [NSMutableData dataWithBytes:advertisementBytes length:21];
         
         NSDictionary *beaconData = [NSDictionary dictionaryWithObject:advertisement forKey:beaconKey];
         [_manager startAdvertising:beaconData];
         
         [self.textFieldUUID setEnabled:NO];
         [self.textFieldMajor setEnabled:NO];
         [self.textFieldMinor setEnabled:NO];
         [self.textFieldPower setEnabled:NO];
         
         [ [self buttonStart] setTitle:@"Stop Broadcasting"];
     }
}

- (void)peripheralManagerDidUpdateState:(CBPeripheralManager *)peripheral {
    
    if (peripheral.state == CBPeripheralManagerStatePoweredOn) {
        
        [self.buttonStart setEnabled:YES];
        [self.textFieldUUID setEnabled:YES];
        [self.textFieldMajor setEnabled:YES];
        [self.textFieldMinor setEnabled:YES];
        [self.textFieldPower setEnabled:YES];
        
        self.textFieldUUID.delegate = self;
    }//end if CBPeripheralManagerStatePoweredOn
}

- (BOOL)control:(NSControl *)control textShouldEndEditing:(NSText *)fieldEditor{
    return YES;
}



@end
