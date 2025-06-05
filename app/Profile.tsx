import { UserContext } from '@/UserContext';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { JSX, useContext } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Typage navigation
type RootStackParamList = {
  ModifierProfil: undefined;
  MissionsRecemment: undefined;
  Confidentialite: undefined;
  Aide: undefined;
  Deconnexion: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface OptionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function ProfilScreen(): JSX.Element {
  const { imageUri, setImageUri } = useContext(UserContext);
  const navigation = useNavigation<NavigationProp>();

  const pickImage = async () => {
    const openCamera = async () => {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission refusée", "Autorisez l'accès à l'appareil photo.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };

    const openGallery = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission refusée", "Autorisez l'accès à vos photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', 'Prendre une photo', 'Choisir depuis la galerie'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera();
          else if (buttonIndex === 2) openGallery();
        }
      );
    } else {
      Alert.alert('Choisir une image', '', [
        { text: 'Prendre une photo', onPress: openCamera },
        { text: 'Galerie', onPress: openGallery },
        { text: 'Annuler', style: 'cancel' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri } as ImageSourcePropType} style={styles.avatar} />
          ) : (
            <View style={styles.avatar} />
          )}
        </TouchableOpacity>
        <Text style={styles.editPhoto}>modifier la photo</Text>
      </View>

      <ScrollView style={styles.options}>
        <Option
          icon={<FontAwesome name="user" size={24} color="#075B7A" />}
          label="Modifier le profil"
          onPress={() => navigation.navigate('ModifierProfil')}
        />
        <Option
          icon={<FontAwesome name="heart-o" size={24} color="#075B7A" />}
          label="Missions récemment consultées"
          onPress={() => navigation.navigate('MissionsRecemment')}
        />
        <Option
          icon={<Feather name="lock" size={24} color="#075B7A" />}
          label="Confidentialité du compte"
          onPress={() => navigation.navigate('Confidentialite')}
        />
        <Option
          icon={<Feather name="settings" size={24} color="#075B7A" />}
          label="Réglage"
          onPress={() => {}}
        />
        <Option
          icon={<Feather name="help-circle" size={24} color="#075B7A" />}
          label="Aide"
          onPress={() => navigation.navigate('Aide')}
        />
        <Option
          icon={<Feather name="log-out" size={24} color="#075B7A" />}
          label="Se déconnecter"
          onPress={() => navigation.navigate('Deconnexion')}
        />
      </ScrollView>
    </View>
  );
}

const Option: React.FC<OptionProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.optionLabel}>{label}</Text>
      <Feather name="chevron-right" size={24} color="#075B7A" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 60,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5CA9B0',
    borderWidth: 3,
    borderColor: '#075B7A',
    resizeMode: 'cover',
  },
  editPhoto: {
    marginTop: 10,
    color: '#075B7A',
    fontSize: 16,
  },
  options: {
    paddingHorizontal: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5FBFD',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  iconWrapper: {
    marginRight: 10,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#075B7A',
  },
});