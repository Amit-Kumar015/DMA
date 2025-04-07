import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    TextInput,
    Keyboard
} from 'react-native';
import Icon from './icon';
import useTheme from '../hooks/useTheme';
import { ScrollView } from 'react-native-gesture-handler';
import Text from './Text';
import { iconSizeSmallSm } from '../utils/theme';

const SelectList = ({
    setSelected,
    setSelectedValFN,
    placeholder,
    boxStyles,
    inputStyles,
    dropdownStyles,
    dropdownItemStyles,
    dropdownTextStyles,
    maxHeight,
    data,
    defaultOption,
    searchicon = false,
    arrowicon = false,
    closeicon = false,
    search = true,
    searchPlaceholder = "search",
    notFoundText = "No data found",
    disabledItemStyles,
    disabledTextStyles,
    onSelect = () => {},
    save = 'key',
    dropdownShown = false,
    fontFamily,
    selectText,
    noDataText
}) => {
    const oldOption = useRef(null);
    const [firstRender, setFirstRender] = useState(true);
    const [dropdown, setDropdown] = useState(dropdownShown);
    const [selectedval, setSelectedVal] = useState('');
    const [height, setHeight] = useState(200);
    const animatedvalue = useRef(new Animated.Value(0)).current;
    const [filtereddata, setFilteredData] = useState(data);
    const { theme } = useTheme();

    const slidedown = () => {
        setDropdown(true);
        Animated.timing(animatedvalue, {
            toValue: height,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const slideup = () => {
        Animated.timing(animatedvalue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start(() => setDropdown(false));
    };

    useEffect(() => {
        if (maxHeight) setHeight(maxHeight);
    }, [maxHeight]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            return;
        }
        onSelect();
    }, [selectedval]);

    useEffect(() => {
        if (!firstRender && defaultOption && oldOption.current !== defaultOption.key) {
            oldOption.current = defaultOption.key;
            setSelected(defaultOption.key);
            setSelectedVal(defaultOption.value);
            setSelectedValFN(defaultOption);
        }
        if (defaultOption && firstRender && defaultOption.key !== undefined) {
            oldOption.current = defaultOption.key;
            setSelected(defaultOption.key);
            setSelectedValFN(defaultOption.value);
            setSelectedVal(defaultOption.value);
            setSelectedValFN(defaultOption);
        }
    }, [defaultOption]);

    useEffect(() => {
        if (!firstRender) {
            dropdownShown ? slidedown() : slideup();
        }
    }, [dropdownShown]);

    return (
        <View>
            {dropdown && search ? (
                <View style={[styles.wrapper, boxStyles]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        {!searchicon ? (
                            <Icon name="magnifying-glass" type='entypo' size={iconSizeSmallSm} />
                        ) : (
                            searchicon
                        )}
                        <TextInput
                            placeholder={searchPlaceholder}
                            onChangeText={(val) => {
                                let result = data.filter((item) => {
                                    let row = typeof item === 'string' ? item.toLowerCase() : item?.value?.toLowerCase();
                                    return row.includes(val.toLowerCase());
                                });
                                setFilteredData(result);
                            }}
                            style={[{ padding: 0, height: 20, flex: 1, fontFamily }, inputStyles]}
                        />
                        <TouchableOpacity onPress={() => slideup()}>
                            {!closeicon ? <Icon name="close" size={iconSizeSmallSm} /> : closeicon}
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    disabled={filtereddata.length === 0}
                    style={[styles.wrapper, boxStyles, filtereddata.length === 0 && { backgroundColor: theme.$surface, opacity: 0.4 }]}
                    onPress={() => {
                        if (!dropdown) {
                            Keyboard.dismiss();
                            slidedown();
                        } else {
                            slideup();
                        }
                    }}
                >
                    <Text style={[{ fontFamily, opacity: selectedval === '' || filtereddata.length === 0 ? 0.5 : 1 }, inputStyles, { width: '94%' }]}>
    {selectedval === "" 
        ? placeholder || (filtereddata.length >= 1 ? selectText || 'Select option' : noDataText || 'No data found') 
        : selectedval}
</Text>
                    {!arrowicon ? ( <Icon  name={dropdown ? 'chevron-up' : 'chevron-down'}  size={iconSizeSmallSm} color={"black"}  style={{right:5}}/>
    ) : arrowicon}

                </TouchableOpacity>
            )}

            {dropdown && filtereddata.length >= 1 ? (
                <Animated.View style={[{ maxHeight: animatedvalue }, styles.dropdown, dropdownStyles]}>
                    <ScrollView contentContainerStyle={{ paddingVertical: 10 }} nestedScrollEnabled>
                        {filtereddata.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.option, dropdownItemStyles]}
                                onPress={() => {
                                    setSelectedValFN(item);
                                    setSelected(save === 'value' ? item.value : item.key);
                                    setSelectedVal(item.value);
                                    slideup();
                                    setTimeout(() => setFilteredData(data), 800);
                                }}
                            >
                                <Text style={[{ fontFamily }, dropdownTextStyles]}>{item.value}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            ) : null}
        </View>
    );
};

export default SelectList;

const styles = StyleSheet.create({
    wrapper: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dropdown: { borderWidth: 1, borderRadius: 10, marginTop: 10 },
    option: { paddingHorizontal: 20, paddingVertical: 8 },
});
